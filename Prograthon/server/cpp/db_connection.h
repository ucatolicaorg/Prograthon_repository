#ifndef DB_CONNECTION_H
#define DB_CONNECTION_H

#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/database.hpp>
#include <string>
#include <memory>

class DBConnection {
public:
    // Método estático para obtener la instancia de la base de datos "Prograthon"
    static mongocxx::database get_db();

private:
    // El constructor es privado para implementar el patrón Singleton
    DBConnection(); 

    // Punteros únicos para gestionar la instancia y el cliente de MongoDB
    static std::unique_ptr<mongocxx::instance> instance;
    static std::unique_ptr<mongocxx::client> client;
};

#endif // DB_CONNECTION_H