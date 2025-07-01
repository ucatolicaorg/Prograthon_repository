# Especifica la versión mínima de CMake y el nombre del proyecto.
cmake_minimum_required(VERSION 3.15)
project(GeneticApiServer CXX)

# Establece el estándar de C++ a C++17.
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Busca las librerías que instalaste con vcpkg.
# CMake se detendrá con un error si no las encuentra.
find_package(mongo-cxx-driver REQUIRED)
find_package(httplib REQUIRED)
find_package(nlohmann_json REQUIRED)

# Define el nombre del programa ejecutable y la lista de archivos fuente (.cpp)
# que se usarán para compilarlo.
add_executable(genetic_api_server
    main.cpp
    db_connection.cpp
    AlgoritmoGenetico.cpp
)

# Enlaza las librerías encontradas a nuestro ejecutable para que pueda usar sus funciones.
target_link_libraries(genetic_api_server PRIVATE
    mongo::mongocxx_shared
    httplib::httplib
    nlohmann_json::nlohmann_json
)