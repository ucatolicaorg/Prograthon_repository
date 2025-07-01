#include "db_connection.h"
#include <iostream>
#include <cstdlib> // Para std::getenv

// Inicialización de los punteros estáticos a nullptr.
std::unique_ptr<mongocxx::instance> DBConnection::instance = nullptr;
std::unique_ptr<mongocxx::client> DBConnection::client = nullptr;

// El constructor privado se llama solo una vez, la primera vez que se accede a la BD.
DBConnection::DBConnection() {
    try {
        // Lee la URI de la variable de entorno, igual que en Node.js.
        const char* uri_env = std::getenv("ATLAS_URI");
        if (!uri_env) {
            std::cerr << "ERROR FATAL: La variable de entorno ATLAS_URI no está configurada." << std::endl;
            exit(EXIT_FAILURE);
        }
        
        mongocxx::uri uri = mongocxx::uri{std::string(uri_env)};
        
        // Crea la instancia del driver y el cliente que se conecta al clúster.
        instance = std::make_unique<mongocxx::instance>();
        client = std::make_unique<mongocxx::client>(uri);

    } catch (const std::exception& e) {
        std::cerr << "Error de conexión con MongoDB: " << e.what() << std::endl;
        exit(EXIT_FAILURE);
    }
}

// Este es el método público que usarás en tu API para obtener la base de datos.
mongocxx::database DBConnection::get_db() {
    // Patrón Singleton: si el cliente no existe, crea una instancia de DBConnection.
    if (!client) {
        static DBConnection db_singleton;
    }
    // Devuelve un manejador para la base de datos "Prograthon".
    return (*client)["Prograthon"]; 
}