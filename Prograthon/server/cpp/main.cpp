#include "httplib.h"
#include "json.hpp"
#include "db_connection.h"
#include "AlgoritmoGenetico.h"

#include <bsoncxx/json.hpp>
#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/types.hpp>
#include <mongocxx/exception/exception.hpp>
#include <iostream>
#include <vector>
#include <chrono>

// Alias para simplificar el código
using json = nlohmann::json;
using bsoncxx::builder::stream::document;
using bsoncxx::builder::stream::open_document;
using bsoncxx::builder::stream::close_document;
using bsoncxx::builder::stream::open_array;
using bsoncxx::builder::stream::close_array;
using bsoncxx::builder::stream::finalize;

int main() {
    httplib::Server svr;
    
    // Obtiene el manejador de la base de datos al iniciar.
    auto db = DBConnection::get_db();
    std::cout << "Conectado a MongoDB. API lista." << std::endl;

    // ENDPOINT: POST /generate
    svr.Post("/generate", [&](const httplib::Request& req, httplib::Response& res) {
        res.set_content_type("application/json");

        try {
            auto input = json::parse(req.body);
            std::string difficulty = input.value("dificulty", ""); // Nota: frontend envía "dificulty"
            std::vector<std::string> topics = input.value("topics", std::vector<std::string>{});
            int problem_count = input.value("problem_count", 0);

            if (problem_count <= 0) {
                res.status = 400;
                res.set_content(json{{"error", "problem_count debe ser mayor a 0."}}.dump(), "application/json");
                return;
            }

            // Consultar problemas en MongoDB
            auto problemas_coll = db["Problemas"];
            // TODO: Se puede expandir el filtro para usar difficulty y topics
            document filter_builder{};
            
            std::vector<Problema> problemas_disponibles;
            for (const auto& doc : problemas_coll.find(filter_builder.view())) {
                problemas_disponibles.push_back({
                    doc["_id"].get_oid().value.to_string(),
                    doc["nombre"].get_string().value.to_string(),
                    doc["tiempoPromedio"].get_int32().value,
                    doc["dificultad"].get_int32().value
                });
            }
            
            if (problemas_disponibles.size() < problem_count) {
                 res.status = 400;
                 res.set_content(json{{"error", "No hay suficientes problemas en la base de datos."}}.dump(), "application/json");
                 return;
            }

            // Ejecutar algoritmo genético
            AlgoritmoGenetico ag(problemas_disponibles, problem_count, 50, 100);
            std::vector<Problema> problemas_optimizados = ag.ejecutar();

            // Guardar la maratón generada en MongoDB
            auto maratones_coll = db["Maratones"];
            auto builder = document{};
            auto array_builder = builder
                << "nombre" << "Maraton Generada IA - " + std::to_string(time(0))
                << "cantidadProblemas" << static_cast<int32_t>(problemas_optimizados.size())
                << "createdAt" << bsoncxx::types::b_date{std::chrono::system_clock::now()}
                << "participantes" << open_array << close_array // Array de participantes vacío
                << "problemas" << open_array;

            for(const auto& p : problemas_optimizados) {
                array_builder << bsoncxx::oid{p.id};
            }
            
            auto doc_final = array_builder << close_array << close_document;
            
            auto result = maratones_coll.insert_one(doc_final.view());
            std::string new_marathon_id = result->inserted_id().get_oid().value.to_string();

            // Devolver el ID de la nueva maratón
            res.status = 201;
            res.set_content(json{{"marathonId", new_marathon_id}}.dump(), "application/json");

        } catch (const json::parse_error& e) {
            res.status = 400; // Bad Request
            res.set_content(json{{"error", "JSON de entrada inválido: " + std::string(e.what())}}.dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 500; // Internal Server Error
            res.set_content(json{{"error", "Error interno del servidor: " + std::string(e.what())}}.dump(), "application/json");
        }
    });

    // ENDPOINTS CRUD de ejemplo para /config
    svr.Get("/config", [&](const httplib::Request& req, httplib::Response& res) {
        json config = {{"population_size", 100}, {"mutation_rate", 0.25}, {"crossover_rate", 0.85}};
        res.set_content(config.dump(), "application/json");
    });

    svr.Put("/config", [&](const httplib::Request& req, httplib::Response& res) {
        res.set_content(json{{"message", "Configuración actualizada (simulado)."}}.dump(), "application/json");
    });
    
    // ENDPOINT: POST /optimize/:marathon_id
    svr.Post(R"(/optimize/(\w+))", [&](const httplib::Request& req, httplib::Response& res) {
        std::string marathon_id = req.matches[1].str();
        res.set_content(json{{"message", "Maratón " + marathon_id + " optimizada (simulado)."}}.dump(), "application/json");
    });

    // Iniciar el servidor en el puerto 8080 para no chocar con Node.js (5050)
    int port = 8080;
    std::cout << "Servidor C++ escuchando en http://localhost:" << port << std::endl;
    svr.listen("0.0.0.0", port);

    return 0;
}