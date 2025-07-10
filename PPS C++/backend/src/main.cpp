#include <iostream>
#include <string>
#include <vector>
#include <random>
#include <chrono>
#include <cstring>
#include "httplib.h"
#include "json.hpp"
#include "libpq-fe.h"
#include "jwt-cpp/jwt.h"
#include <argon2.h>

using json = nlohmann::json;

// --- CONFIGURACIÓN ---
const char* CONN_STRING = "dbname=programming_contest_db user=postgres password=btsyjulian host=localhost port=5432";
const std::string JWT_SECRET = "una_clave_muy_secreta_y_larga_que_nadie_deberia_adivinar_facilmente";

// --- ESTRUCTURA DE USUARIO AUTENTICADO ---
struct AuthUser {
    bool isAuthenticated = false;
    std::string username;
    std::string role;
    int userId = -1;
};

// --- VERIFICACIÓN DE TOKEN JWT ---
AuthUser verifyTokenAndGetUser(const httplib::Request& req) {
    if (!req.has_header("Authorization")) return {};
    std::string auth_header = req.get_header_value("Authorization");
    if (auth_header.rfind("Bearer ", 0) != 0) return {};
    std::string token_str = auth_header.substr(7);

    try {
        auto decoded = jwt::decode(token_str);
        jwt::verify()
            .allow_algorithm(jwt::algorithm::hs256{JWT_SECRET})
            .with_issuer("ProgrammingContestAPI")
            .verify(decoded);

        AuthUser u;
        u.isAuthenticated = true;
        u.userId    = std::stoi(decoded.get_payload_claim("user_id").as_string());
        u.username  = decoded.get_payload_claim("username").as_string();
        u.role      = decoded.get_payload_claim("role").as_string();
        return u;
    } catch (...) {
        return {};
    }
}

// --- ARGON2 HASHING ---
std::string hash_password(const std::string& password) {
    std::vector<uint8_t> salt(16);
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<uint8_t> dis(0, 255);
    for (auto& b : salt) b = dis(gen);

    uint32_t t_cost      = 2;
    uint32_t m_cost      = (1 << 16);
    uint32_t parallelism = 1;
    uint32_t hashlen     = 32;

    size_t encoded_len = argon2_encodedlen(t_cost, m_cost, parallelism,
                                            static_cast<uint32_t>(salt.size()),
                                            hashlen, Argon2_id);
    std::vector<char> encoded(encoded_len);

    int ret = argon2id_hash_encoded(
        t_cost, m_cost, parallelism,
        password.c_str(), password.size(),
        salt.data(), salt.size(),
        hashlen, encoded.data(), encoded_len);

    if (ret != ARGON2_OK) {
        throw std::runtime_error(argon2_error_message(ret));
    }
    return std::string(encoded.data());
}

bool verify_password(const std::string& password, const std::string& hash) {
    return argon2id_verify(hash.c_str(), password.c_str(), password.size()) == ARGON2_OK;
}

int main() {
    // Conexión a PostgreSQL
    PGconn* conn = PQconnectdb(CONN_STRING);
    if (PQstatus(conn) != CONNECTION_OK) {
        std::cerr << "Error de conexión: " << PQerrorMessage(conn) << std::endl;
        return 1;
    }
    std::cout << "Conexión a PostgreSQL exitosa." << std::endl;

    httplib::Server svr;

    // --- CORS (único punto) ---
    svr.set_pre_routing_handler([](const auto& /*req*/, auto& res) {
        res.set_header("Access-Control-Allow-Origin",  "*");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        return httplib::Server::HandlerResponse::Unhandled;
    });
    svr.Options(R"((.*))", [](const auto& /*req*/, auto& res) {
        res.status = 204;
    });

    // --- ENDPOINT: Registro ---
    svr.Post("/api/register", [&](const auto& req, auto& res) {
        res.set_header("Content-Type", "application/json");
        try {
            json body = json::parse(req.body);
            std::string username = body.at("username");
            std::string password = body.at("password");
            std::string role     = body.at("role");

            if (role!="student" && role!="professor" && role!="admin") {
                res.status = 400;
                res.set_content(json{{"success",false},{"message","Rol inválido"}}.dump(), "application/json");
                return;
            }
            std::string pwd_hash = hash_password(password);
            const char* params[3] = { username.c_str(), pwd_hash.c_str(), role.c_str() };
            PGresult* r = PQexecParams(conn,
                "INSERT INTO users (username,password_hash,role) VALUES($1,$2,$3)",
                3, NULL, params, NULL, NULL, 0);
            if (PQresultStatus(r) != PGRES_COMMAND_OK) {
                std::string err = PQerrorMessage(conn);
                if (err.find("duplicate") != std::string::npos) {
                    res.status = 409;
                    res.set_content(json{{"success",false},{"message","Usuario ya existe"}}.dump(),"application/json");
                } else {
                    res.status = 500;
                    res.set_content(json{{"success",false},{"message","Error interno"}}.dump(),"application/json");
                }
            } else {
                res.status = 201;
                res.set_content(json{{"success",true},{"message","Usuario registrado"}}.dump(),"application/json");
            }
            PQclear(r);
        } catch (...) {
            res.status = 400;
            res.set_content(json{{"success",false},{"message","Datos inválidos"}}.dump(),"application/json");
        }
    });

    // --- ENDPOINT: Login ---
    svr.Post("/api/login", [&](const auto& req, auto& res) {
        res.set_header("Content-Type", "application/json");
        try {
            json body = json::parse(req.body);
            std::string username = body.at("username");
            std::string password = body.at("password");

            const char* p[1] = { username.c_str() };
            PGresult* r = PQexecParams(conn,
                "SELECT id,password_hash,role FROM users WHERE username=$1",
                1, NULL, p, NULL, NULL, 0);

            if (PQntuples(r)==1) {
                std::string stored = PQgetvalue(r,0,1);
                if (verify_password(password, stored)) {
                    int uid   = std::stoi(PQgetvalue(r,0,0));
                    std::string role = PQgetvalue(r,0,2);
                    auto token = jwt::create()
                        .set_issuer("ProgrammingContestAPI")
                        .set_type("JWS")
                        .set_issued_at(std::chrono::system_clock::now())
                        .set_expires_at(std::chrono::system_clock::now()+std::chrono::hours{24})
                        .set_payload_claim("user_id", jwt::claim(std::to_string(uid)))
                        .set_payload_claim("username", jwt::claim(username))
                        .set_payload_claim("role", jwt::claim(role))
                        .sign(jwt::algorithm::hs256{JWT_SECRET});

                    res.status = 200;
                    res.set_content(json{
                        {"success",true},
                        {"token",token},
                        {"user",{ {"id",uid},{"username",username},{"role",role} }}
                    }.dump(),"application/json");
                } else {
                    res.status = 401;
                    res.set_content(json{{"success",false},{"message","Credenciales inválidas"}}.dump(),"application/json");
                }
            } else {
                res.status = 401;
                res.set_content(json{{"success",false},{"message","Credenciales inválidas"}}.dump(),"application/json");
            }
            PQclear(r);
        } catch (...) {
            res.status = 400;
            res.set_content(json{{"success",false},{"message","Datos inválidos"}}.dump(),"application/json");
        }
    });

    // --- ENDPOINT: Obtener usuario actual ---
    svr.Get("/api/me", [&](const auto& req, auto& res) {
        res.set_header("Content-Type","application/json");
        AuthUser u = verifyTokenAndGetUser(req);
        if (!u.isAuthenticated) {
            res.status = 401;
            res.set_content(json{{"success",false},{"message","No autenticado"}}.dump(),"application/json");
        } else {
            res.status = 200;
            res.set_content(json{
                {"success",true},
                {"user",{
                    {"id",u.userId},
                    {"username",u.username},
                    {"role",u.role}
                }}
            }.dump(),"application/json");
        }
    });

    // --- ENDPOINTS DE MARATONES ---
    // Crear maratón con límite de problemas
    svr.Post("/api/marathons", [&](const auto& req, auto& res) {
        res.set_header("Content-Type","application/json");
        AuthUser u = verifyTokenAndGetUser(req);
        if (!u.isAuthenticated || (u.role!="admin" && u.role!="professor")) {
            res.status = 403;
            res.set_content(json{{"success",false},{"message","Permiso denegado"}}.dump(),"application/json");
            return;
        }
        try {
            json body = json::parse(req.body);
            std::string name  = body.at("name");
            std::string desc  = body.at("description");
            int maxp          = body.at("max_problems");
            std::string uid   = std::to_string(u.userId);
            const char* params[4] = {
              name.c_str(), desc.c_str(), uid.c_str(),
              std::to_string(maxp).c_str()
            };
            PGresult* r = PQexecParams(conn,
              "INSERT INTO marathons (name,description,created_by,max_problems) "
              "VALUES($1,$2,$3,$4) RETURNING id",
              4, NULL, params, NULL, NULL, 0);
            if (PQresultStatus(r)==PGRES_TUPLES_OK) {
                int mid = std::stoi(PQgetvalue(r,0,0));
                res.status = 201;
                res.set_content(json{{"success",true},{"id",mid}}.dump(),"application/json");
            } else {
                res.status = 500;
                res.set_content(json{{"success",false},{"message","Error al crear maratón"}}.dump(),"application/json");
            }
            PQclear(r);
        } catch (...) {
            res.status = 400;
            res.set_content(json{{"success",false},{"message","Datos inválidos"}}.dump(),"application/json");
        }
    });

    // Listar todas las maratones
    svr.Get("/api/marathons", [&](const auto& req, auto& res) {
        res.set_header("Content-Type","application/json");
        AuthUser u = verifyTokenAndGetUser(req);
        if (!u.isAuthenticated) {
            res.status = 401;
            res.set_content(json{{"success",false},{"message","No autenticado"}}.dump(),"application/json");
            return;
        }
        PGresult* r = PQexec(conn,
            "SELECT m.id,m.name,m.description,m.created_at,u.username,m.max_problems "
            "FROM marathons m JOIN users u ON m.created_by=u.id "
            "ORDER BY m.created_at DESC");
        json arr = json::array();
        for (int i=0;i<PQntuples(r);++i) {
            arr.push_back({
              {"id", std::stoi(PQgetvalue(r,i,0))},
              {"name", PQgetvalue(r,i,1)},
              {"description", PQgetvalue(r,i,2)},
              {"created_at", PQgetvalue(r,i,3)},
              {"created_by", PQgetvalue(r,i,4)},
              {"max_problems", std::stoi(PQgetvalue(r,i,5))}
            });
        }
        PQclear(r);
        res.status = 200;
        res.set_content(json{{"success",true},{"marathons",arr}}.dump(),"application/json");
    });

    // Detalle de maratón + problemas asignados
    svr.Get(R"(/api/marathons/(\d+))", [&](const auto& req, auto& res) {
        res.set_header("Content-Type","application/json");
        AuthUser u = verifyTokenAndGetUser(req);
        if (!u.isAuthenticated) {
            res.status = 401; res.set_content(json{{"success",false},{"message","No autenticado"}}.dump(),"application/json");
            return;
        }
        std::string mid = req.matches[1];
        const char* p_mid[1] = { mid.c_str() };

        // Datos de la maratón
        PGresult* r1 = PQexecParams(conn,
            "SELECT m.id,m.name,m.description,m.created_at,u.username,m.max_problems "
            "FROM marathons m JOIN users u ON m.created_by=u.id WHERE m.id=$1",
            1,NULL,p_mid,NULL,NULL,0);
        if (PQntuples(r1)!=1) {
            res.status = 404; res.set_content(json{{"success",false},{"message","No encontrada"}}.dump(),"application/json");
            PQclear(r1); return;
        }
        json m = {
          {"id", std::stoi(PQgetvalue(r1,0,0))},
          {"name", PQgetvalue(r1,0,1)},
          {"description", PQgetvalue(r1,0,2)},
          {"created_at", PQgetvalue(r1,0,3)},
          {"created_by", PQgetvalue(r1,0,4)},
          {"max_problems", std::stoi(PQgetvalue(r1,0,5))}
        };
        PQclear(r1);

        // Problemas asignados
        PGresult* r2 = PQexecParams(conn,
            "SELECT p.id,p.title,p.description,p.difficulty "
            "FROM problems p JOIN marathon_problems mp ON p.id=mp.problem_id "
            "WHERE mp.marathon_id=$1",
            1,NULL,p_mid,NULL,NULL,0);
        json arr = json::array();
        for (int i=0;i<PQntuples(r2);++i) {
            arr.push_back({
              {"id", std::stoi(PQgetvalue(r2,i,0))},
              {"title", PQgetvalue(r2,i,1)},
              {"description", PQgetvalue(r2,i,2)},
              {"difficulty", PQgetvalue(r2,i,3)}
            });
        }
        PQclear(r2);

        res.status = 200;
        res.set_content(json{{"success",true},{"marathon",m},{"problems",arr}}.dump(),"application/json");
    });

    // Añadir problema a maratón (hasta límite)
    svr.Post(R"(/api/marathons/(\d+)/problems)", [&](const auto& req, auto& res) {
        res.set_header("Content-Type","application/json");
        AuthUser u = verifyTokenAndGetUser(req);
        if (!u.isAuthenticated || (u.role!="admin" && u.role!="professor")) {
            res.status = 403; res.set_content(json{{"success",false},{"message","Permiso denegado"}}.dump(),"application/json");
            return;
        }
        std::string mid = req.matches[1];
        try {
            json body = json::parse(req.body);
            int pid = body.at("problem_id");
            const char* p_mid[1] = { mid.c_str() };

            // Verificar límite
            PGresult* r1 = PQexecParams(conn,
              "SELECT max_problems,(SELECT COUNT(*) FROM marathon_problems WHERE marathon_id=$1) "
              "FROM marathons WHERE id=$1",
              1,NULL,p_mid,NULL,NULL,0);
            int maxp = std::stoi(PQgetvalue(r1,0,0));
            int cnt  = std::stoi(PQgetvalue(r1,0,1));
            PQclear(r1);
            if (cnt >= maxp) {
                res.status = 400;
                res.set_content(json{{"success",false},{"message","Límite alcanzado"}}.dump(),"application/json");
                return;
            }

            const char* p2[2] = { std::to_string(pid).c_str(), mid.c_str() };
            PGresult* r2 = PQexecParams(conn,
              "INSERT INTO marathon_problems (problem_id,marathon_id) VALUES($1,$2)",
              2,NULL,p2,NULL,NULL,0);
            if (PQresultStatus(r2)==PGRES_COMMAND_OK) {
                res.status = 201;
                res.set_content(json{{"success",true},{"message","Problema asignado"}}.dump(),"application/json");
            } else {
                res.status = 500;
                res.set_content(json{{"success",false},{"message","Error al asignar"}}.dump(),"application/json");
            }
            PQclear(r2);
        } catch (...) {
            res.status = 400;
            res.set_content(json{{"success",false},{"message","Datos inválidos"}}.dump(),"application/json");
        }
    });

    // Eliminar problema
svr.Delete(R"(/api/problems/(\d+))", [&](const auto& req, auto& res) {
    res.set_header("Content-Type","application/json");
    AuthUser u = verifyTokenAndGetUser(req);
    if (!u.isAuthenticated || (u.role!="admin" && u.role!="professor")) {
        res.status = 403;
        res.set_content(json{{"success",false},{"message","Permiso denegado"}}.dump(),"application/json");
        return;
    }
    std::string pid = req.matches[1];
    const char* p_pid[1] = { pid.c_str() };
    
    // Primero eliminar referencias en marathon_problems
    PGresult* r1 = PQexecParams(conn,
        "DELETE FROM marathon_problems WHERE problem_id=$1",
        1,NULL,p_pid,NULL,NULL,0);
    PQclear(r1);
    
    // Luego eliminar el problema
    PGresult* r2 = PQexecParams(conn,
        "DELETE FROM problems WHERE id=$1",
        1,NULL,p_pid,NULL,NULL,0);
    if (PQresultStatus(r2)==PGRES_COMMAND_OK) {
        res.status = 200;
        res.set_content(json{{"success",true},{"message","Problema eliminado"}}.dump(),"application/json");
    } else {
        res.status = 500;
        res.set_content(json{{"success",false},{"message","Error al eliminar"}}.dump(),"application/json");
    }
    PQclear(r2);
});

// Eliminar problema de maratón
svr.Delete(R"(/api/marathons/(\d+)/problems/(\d+))", [&](const auto& req, auto& res) {
    res.set_header("Content-Type","application/json");
    AuthUser u = verifyTokenAndGetUser(req);
    if (!u.isAuthenticated || (u.role!="admin" && u.role!="professor")) {
        res.status = 403;
        res.set_content(json{{"success",false},{"message","Permiso denegado"}}.dump(),"application/json");
        return;
    }
    std::string mid = req.matches[1];
    std::string pid = req.matches[2];
    const char* p[2] = { mid.c_str(), pid.c_str() };
    
    PGresult* r = PQexecParams(conn,
        "DELETE FROM marathon_problems WHERE marathon_id=$1 AND problem_id=$2",
        2,NULL,p,NULL,NULL,0);
    if (PQresultStatus(r)==PGRES_COMMAND_OK) {
        res.status = 200;
        res.set_content(json{{"success",true},{"message","Problema eliminado de la maratón"}}.dump(),"application/json");
    } else {
        res.status = 500;
        res.set_content(json{{"success",false},{"message","Error al eliminar problema"}}.dump(),"application/json");
    }
    PQclear(r);
});


// Eliminar maratón
svr.Delete(R"(/api/marathons/(\d+))", [&](const auto& req, auto& res) {
    res.set_header("Content-Type","application/json");
    AuthUser u = verifyTokenAndGetUser(req);
    if (!u.isAuthenticated || (u.role!="admin" && u.role!="professor")) {
        res.status = 403;
        res.set_content(json{{"success",false},{"message","Permiso denegado"}}.dump(),"application/json");
        return;
    }
    std::string mid = req.matches[1];
    const char* p_mid[1] = { mid.c_str() };
    
    // Eliminar registros y problemas asociados
    PGresult* r1 = PQexecParams(conn,
        "DELETE FROM marathon_registrations WHERE marathon_id=$1",
        1,NULL,p_mid,NULL,NULL,0);
    PQclear(r1);
    
    PGresult* r2 = PQexecParams(conn,
        "DELETE FROM marathon_problems WHERE marathon_id=$1",
        1,NULL,p_mid,NULL,NULL,0);
    PQclear(r2);
    
    // Eliminar la maratón
    PGresult* r3 = PQexecParams(conn,
        "DELETE FROM marathons WHERE id=$1",
        1,NULL,p_mid,NULL,NULL,0);
    if (PQresultStatus(r3)==PGRES_COMMAND_OK) {
        res.status = 200;
        res.set_content(json{{"success",true},{"message","Maratón eliminada"}}.dump(),"application/json");
    } else {
        res.status = 500;
        res.set_content(json{{"success",false},{"message","Error al eliminar"}}.dump(),"application/json");
    }
    PQclear(r3);
});

// Ver estudiantes registrados en una maratón
svr.Get(R"(/api/marathons/(\d+)/students)", [&](const auto& req, auto& res) {
    res.set_header("Content-Type","application/json");
    AuthUser u = verifyTokenAndGetUser(req);
    if (!u.isAuthenticated) {
        res.status = 401;
        res.set_content(json{{"success",false},{"message","No autenticado"}}.dump(),"application/json");
        return;
    }
    std::string mid = req.matches[1];
    const char* p_mid[1] = { mid.c_str() };
    
    PGresult* r = PQexecParams(conn,
        "SELECT u.id,u.username,mr.registered_at "
        "FROM users u JOIN marathon_registrations mr ON u.id=mr.user_id "
        "WHERE mr.marathon_id=$1 AND u.role='student' ORDER BY mr.registered_at",
        1,NULL,p_mid,NULL,NULL,0);
    json arr = json::array();
    for (int i=0;i<PQntuples(r);++i) {
        arr.push_back({
          {"id", std::stoi(PQgetvalue(r,i,0))},
          {"username", PQgetvalue(r,i,1)},
          {"registered_at", PQgetvalue(r,i,2)}
        });
    }
    PQclear(r);
    res.status = 200;
    res.set_content(json{{"success",true},{"students",arr}}.dump(),"application/json");
});

// Eliminar estudiante de maratón
svr.Delete(R"(/api/marathons/(\d+)/students/(\d+))", [&](const auto& req, auto& res) {
    res.set_header("Content-Type","application/json");
    AuthUser u = verifyTokenAndGetUser(req);
    if (!u.isAuthenticated || (u.role!="admin" && u.role!="professor")) {
        res.status = 403;
        res.set_content(json{{"success",false},{"message","Permiso denegado"}}.dump(),"application/json");
        return;
    }
    std::string mid = req.matches[1];
    std::string uid = req.matches[2];
    const char* p[2] = { uid.c_str(), mid.c_str() };
    
    PGresult* r = PQexecParams(conn,
        "DELETE FROM marathon_registrations WHERE user_id=$1 AND marathon_id=$2",
        2,NULL,p,NULL,NULL,0);
    if (PQresultStatus(r)==PGRES_COMMAND_OK) {
        res.status = 200;
        res.set_content(json{{"success",true},{"message","Estudiante eliminado"}}.dump(),"application/json");
    } else {
        res.status = 500;
        res.set_content(json{{"success",false},{"message","Error al eliminar"}}.dump(),"application/json");
    }
    PQclear(r);
});

    // --- ENDPOINTS DE PROBLEMAS ---
    // Crear problema
    svr.Post("/api/problems", [&](const auto& req, auto& res) {
        res.set_header("Content-Type","application/json");
        AuthUser u = verifyTokenAndGetUser(req);
        if (!u.isAuthenticated || (u.role!="admin"&&u.role!="professor")) {
            res.status = 403;
            res.set_content(json{{"success",false},{"message","Permiso denegado"}}.dump(),"application/json");
            return;
        }
        try {
            json body = json::parse(req.body);
            std::string title      = body.at("title");
            std::string desc       = body.at("description");
            std::string difficulty = body.at("difficulty");
            int user_id            = u.userId;

            if (difficulty!="easy"&&difficulty!="medium"&&difficulty!="hard") {
                res.status = 400;
                res.set_content(json{{"success",false},{"message","Dificultad inválida"}}.dump(),"application/json");
                return;
            }

            const char* p[4] = {
              title.c_str(), desc.c_str(), difficulty.c_str(),
              std::to_string(user_id).c_str()
            };
            PGresult* r = PQexecParams(conn,
              "INSERT INTO problems (title,description,difficulty,created_by) VALUES($1,$2,$3,$4) RETURNING id",
              4,NULL,p,NULL,NULL,0);
            if (PQresultStatus(r)==PGRES_TUPLES_OK) {
                int pid = std::stoi(PQgetvalue(r,0,0));
                res.status = 201;
                res.set_content(json{{"success",true},{"id",pid}}.dump(),"application/json");
            } else {
                res.status = 500;
                res.set_content(json{{"success",false},{"message","Error al crear problema"}}.dump(),"application/json");
            }
            PQclear(r);
        } catch(...) {
            res.status = 400;
            res.set_content(json{{"success",false},{"message","Datos inválidos"}}.dump(),"application/json");
        }
    });

    // Listar problemas
    svr.Get("/api/problems", [&](const auto& req, auto& res) {
        res.set_header("Content-Type","application/json");
        AuthUser u = verifyTokenAndGetUser(req);
        if (!u.isAuthenticated) {
            res.status = 401;
            res.set_content(json{{"success",false},{"message","No autenticado"}}.dump(),"application/json");
            return;
        }
        PGresult* r = PQexec(conn,
            "SELECT p.id,p.title,p.description,p.difficulty,p.created_at,u.username "
            "FROM problems p JOIN users u ON p.created_by=u.id ORDER BY p.created_at DESC");
        json arr = json::array();
        for(int i=0;i<PQntuples(r);++i){
            arr.push_back({
              {"id", std::stoi(PQgetvalue(r,i,0))},
              {"title", PQgetvalue(r,i,1)},
              {"description", PQgetvalue(r,i,2)},
              {"difficulty", PQgetvalue(r,i,3)},
              {"created_at", PQgetvalue(r,i,4)},
              {"created_by", PQgetvalue(r,i,5)}
            });
        }
        PQclear(r);
        res.status = 200;
        res.set_content(json{{"success",true},{"problems",arr}}.dump(),"application/json");
    });

    // Detalle de problema
    svr.Get(R"(/api/problems/(\d+))", [&](const auto& req, auto& res) {
        res.set_header("Content-Type","application/json");
        AuthUser u = verifyTokenAndGetUser(req);
        if (!u.isAuthenticated) {
            res.status = 401; res.set_content(json{{"success",false},{"message","No autenticado"}}.dump(),"application/json");
            return;
        }
        std::string pid = req.matches[1];
        const char* p_pid[1] = { pid.c_str() };
        PGresult* r = PQexecParams(conn,
            "SELECT p.id,p.title,p.description,p.difficulty,p.created_at,u.username "
            "FROM problems p JOIN users u ON p.created_by=u.id WHERE p.id=$1",
            1,NULL,p_pid,NULL,NULL,0);
        if (PQntuples(r)==1) {
            json pr = {
              {"id", std::stoi(PQgetvalue(r,0,0))},
              {"title", PQgetvalue(r,0,1)},
              {"description", PQgetvalue(r,0,2)},
              {"difficulty", PQgetvalue(r,0,3)},
              {"created_at", PQgetvalue(r,0,4)},
              {"created_by", PQgetvalue(r,0,5)}
            };
            res.status = 200;
            res.set_content(json{{"success",true},{"problem",pr}}.dump(),"application/json");
        } else {
            res.status = 404;
            res.set_content(json{{"success",false},{"message","No encontrado"}}.dump(),"application/json");
        }
        PQclear(r);
    });

    // Inscribir estudiante en maratón
    svr.Post(R"(/api/marathons/(\d+)/register)", [&](const auto& req, auto& res) {
        res.set_header("Content-Type","application/json");
        AuthUser u = verifyTokenAndGetUser(req);
        if (!u.isAuthenticated || u.role!="student") {
            res.status = 403;
            res.set_content(json{{"success",false},{"message","Solo estudiantes"}}.dump(),"application/json");
            return;
        }
        std::string mid = req.matches[1];
        const char* p[2] = { std::to_string(u.userId).c_str(), mid.c_str() };
        PGresult* r = PQexecParams(conn,
            "INSERT INTO marathon_registrations (user_id,marathon_id) VALUES($1,$2)",
            2,NULL,p,NULL,NULL,0);
        if (PQresultStatus(r)==PGRES_COMMAND_OK) {
            res.status = 201;
            res.set_content(json{{"success",true},{"message","Inscripción exitosa"}}.dump(),"application/json");
        } else {
            std::string err = PQerrorMessage(conn);
            if (err.find("duplicate")!=std::string::npos) {
                res.status = 409;
                res.set_content(json{{"success",false},{"message","Ya inscrito"}}.dump(),"application/json");
            } else {
                res.status = 500;
                res.set_content(json{{"success",false},{"message","Error en inscripción"}}.dump(),"application/json");
            }
        }
        PQclear(r);
    });

    // Ver mis inscripciones
    svr.Get("/api/my-marathons", [&](const auto& req, auto& res) {
        res.set_header("Content-Type","application/json");
        AuthUser u = verifyTokenAndGetUser(req);
        if (!u.isAuthenticated || u.role!="student") {
            res.status = 403;
            res.set_content(json{{"success",false},{"message","Solo estudiantes"}}.dump(),"application/json");
            return;
        }
        const char* p[1] = { std::to_string(u.userId).c_str() };
        PGresult* r = PQexecParams(conn,
            "SELECT m.id,m.name,m.description,mr.registered_at "
            "FROM marathons m JOIN marathon_registrations mr ON m.id=mr.marathon_id "
            "WHERE mr.user_id=$1 ORDER BY mr.registered_at DESC",
            1,NULL,p,NULL,NULL,0);
        json arr = json::array();
        for (int i=0;i<PQntuples(r);++i) {
            arr.push_back({
              {"id", std::stoi(PQgetvalue(r,i,0))},
              {"name", PQgetvalue(r,i,1)},
              {"description", PQgetvalue(r,i,2)},
              {"registered_at", PQgetvalue(r,i,3)}
            });
        }
        PQclear(r); 
        res.status = 200;
        res.set_content(json{{"success",true},{"marathons",arr}}.dump(),"application/json");
    });


// --- ENDPOINTS DE USUARIOS ---
// Listar usuarios
svr.Get("/api/users", [&](const auto& req, auto& res) {
    res.set_header("Content-Type","application/json");
    AuthUser u = verifyTokenAndGetUser(req);
    if (!u.isAuthenticated) {
        res.status = 401;
        res.set_content(json{{"success",false},{"message","No autenticado"}}.dump(),"application/json");
        return;
    }
    
    std::string query;
    if (u.role == "student") {
        query = "SELECT id,username,role,created_at FROM users WHERE role='student' ORDER BY username";
    } else if (u.role == "professor") {
        query = "SELECT id,username,role,created_at FROM users WHERE role IN ('student','professor') ORDER BY role,username";
    } else if (u.role == "admin") {
        query = "SELECT id,username,role,created_at FROM users ORDER BY role,username";
    } else {
        res.status = 403;
        res.set_content(json{{"success",false},{"message","Permiso denegado"}}.dump(),"application/json");
        return;
    }
    
    PGresult* r = PQexec(conn, query.c_str());
    json arr = json::array();
    for (int i=0;i<PQntuples(r);++i) {
        json user_obj;
        user_obj["username"] = PQgetvalue(r,i,1);
        user_obj["role"] = PQgetvalue(r,i,2);
        
        // Solo incluir ID y fecha de creación para administradores
        if (u.role == "admin") {
            user_obj["id"] = std::stoi(PQgetvalue(r,i,0));
            user_obj["created_at"] = PQgetvalue(r,i,3);
        }
        
        arr.push_back(user_obj);
    }
    PQclear(r);
    res.status = 200;
    res.set_content(json{{"success",true},{"users",arr}}.dump(),"application/json");
});

// Actualizar perfil propio
svr.Put("/api/profile", [&](const auto& req, auto& res) {
    res.set_header("Content-Type","application/json");
    AuthUser u = verifyTokenAndGetUser(req);
    if (!u.isAuthenticated) {
        res.status = 401;
        res.set_content(json{{"success",false},{"message","No autenticado"}}.dump(),"application/json");
        return;
    }
    
    try {
        json body = json::parse(req.body);
        std::string username = body.at("username");
        std::string password = body.at("password");
        
        std::string pwd_hash = hash_password(password);
        const char* params[3] = { username.c_str(), pwd_hash.c_str(), std::to_string(u.userId).c_str() };
        PGresult* r = PQexecParams(conn,
            "UPDATE users SET username=$1, password_hash=$2 WHERE id=$3",
            3, NULL, params, NULL, NULL, 0);
        
        if (PQresultStatus(r) == PGRES_COMMAND_OK) {
            res.status = 200;
            res.set_content(json{{"success",true},{"message","Perfil actualizado"}}.dump(),"application/json");
        } else {
            std::string err = PQerrorMessage(conn);
            if (err.find("duplicate") != std::string::npos) {
                res.status = 409;
                res.set_content(json{{"success",false},{"message","Usuario ya existe"}}.dump(),"application/json");
            } else {
                res.status = 500;
                res.set_content(json{{"success",false},{"message","Error al actualizar"}}.dump(),"application/json");
            }
        }
        PQclear(r);
    } catch (...) {
        res.status = 400;
        res.set_content(json{{"success",false},{"message","Datos inválidos"}}.dump(),"application/json");
    }
});

// Actualizar usuario (solo admin)
svr.Put(R"(/api/users/(\d+))", [&](const auto& req, auto& res) {
    res.set_header("Content-Type","application/json");
    AuthUser u = verifyTokenAndGetUser(req);
    if (!u.isAuthenticated || u.role != "admin") {
        res.status = 403;
        res.set_content(json{{"success",false},{"message","Solo admin"}}.dump(),"application/json");
        return;
    }
    
    std::string uid = req.matches[1];
    try {
        json body = json::parse(req.body);
        std::string username = body.at("username");
        std::string password = body.at("password");
        std::string role = body.at("role");
        
        if (role!="student" && role!="professor" && role!="admin") {
            res.status = 400;
            res.set_content(json{{"success",false},{"message","Rol inválido"}}.dump(),"application/json");
            return;
        }
        
        std::string pwd_hash = hash_password(password);
        const char* params[4] = { username.c_str(), pwd_hash.c_str(), role.c_str(), uid.c_str() };
        PGresult* r = PQexecParams(conn,
            "UPDATE users SET username=$1, password_hash=$2, role=$3 WHERE id=$4",
            4, NULL, params, NULL, NULL, 0);
        
        if (PQresultStatus(r) == PGRES_COMMAND_OK) {
            res.status = 200;
            res.set_content(json{{"success",true},{"message","Usuario actualizado"}}.dump(),"application/json");
        } else {
            std::string err = PQerrorMessage(conn);
            if (err.find("duplicate") != std::string::npos) {
                res.status = 409;
                res.set_content(json{{"success",false},{"message","Usuario ya existe"}}.dump(),"application/json");
            } else {
                res.status = 500;
                res.set_content(json{{"success",false},{"message","Error al actualizar"}}.dump(),"application/json");
            }
        }
        PQclear(r);
    } catch (...) {
        res.status = 400;
        res.set_content(json{{"success",false},{"message","Datos inválidos"}}.dump(),"application/json");
    }
});

// Eliminar usuario (solo admin)
svr.Delete(R"(/api/users/(\d+))", [&](const auto& req, auto& res) {
    res.set_header("Content-Type","application/json");
    AuthUser u = verifyTokenAndGetUser(req);
    if (!u.isAuthenticated || u.role != "admin") {
        res.status = 403;
        res.set_content(json{{"success",false},{"message","Solo admin"}}.dump(),"application/json");
        return;
    }
    
    std::string uid = req.matches[1];
    if (std::stoi(uid) == u.userId) {
        res.status = 400;
        res.set_content(json{{"success",false},{"message","No puedes eliminarte a ti mismo"}}.dump(),"application/json");
        return;
    }
    
    const char* p_uid[1] = { uid.c_str() };
    
    // Eliminar registros de maratón
    PGresult* r1 = PQexecParams(conn,
        "DELETE FROM marathon_registrations WHERE user_id=$1",
        1,NULL,p_uid,NULL,NULL,0);
    PQclear(r1);
    
    // Eliminar el usuario
    PGresult* r2 = PQexecParams(conn,
        "DELETE FROM users WHERE id=$1",
        1,NULL,p_uid,NULL,NULL,0);
    if (PQresultStatus(r2)==PGRES_COMMAND_OK) {
        res.status = 200;
        res.set_content(json{{"success",true},{"message","Usuario eliminado"}}.dump(),"application/json");
    } else {
        res.status = 500;
        res.set_content(json{{"success",false},{"message","Error al eliminar"}}.dump(),"application/json");
    }
    PQclear(r2);
});


    // Health check
    svr.Get("/api/health", [&](const auto&, auto& res) {
        res.set_header("Content-Type","application/json");
        res.status = 200;
        res.set_content(json{{"status","OK"},{"message","Servidor OK"}}.dump(),"application/json");
    });

    std::cout << "Servidor escuchando en http://localhost:8080\n";
    svr.listen("0.0.0.0", 8080);

    PQfinish(conn);
    return 0;
}
