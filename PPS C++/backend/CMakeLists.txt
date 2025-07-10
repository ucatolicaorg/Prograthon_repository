# Versión mínima de CMake
cmake_minimum_required(VERSION 3.15)

# Nombre del proyecto
project(ProgrammingContestAPI CXX)

# Establecer el estándar de C++
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Incluir vcpkg
set(CMAKE_TOOLCHAIN_FILE "C:/vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "Vcpkg toolchain file")

# Encontrar librerías
find_package(PostgreSQL REQUIRED)
find_package(jwt-cpp REQUIRED)

# Buscar Argon2 manualmente
find_path(ARGON2_INCLUDE_DIR argon2.h
    PATHS ${CMAKE_PREFIX_PATH}/include
    PATH_SUFFIXES argon2
)

find_library(ARGON2_LIBRARY
    NAMES argon2 libargon2
    PATHS ${CMAKE_PREFIX_PATH}/lib
)

# Verificar que se encontró Argon2
if(NOT ARGON2_INCLUDE_DIR OR NOT ARGON2_LIBRARY)
    message(FATAL_ERROR "Argon2 not found! Include: ${ARGON2_INCLUDE_DIR}, Library: ${ARGON2_LIBRARY}")
endif()

# Definir carpetas de include
include_directories(
    "${CMAKE_CURRENT_SOURCE_DIR}/include"
    ${PostgreSQL_INCLUDE_DIRS}
    ${ARGON2_INCLUDE_DIR}
)

# Crear el ejecutable
add_executable(server src/main.cpp)

# Enlazar las librerías necesarias
target_link_libraries(server PRIVATE
    ${PostgreSQL_LIBRARIES}
    ${ARGON2_LIBRARY}
    ws2_32
    jwt-cpp::jwt-cpp
)