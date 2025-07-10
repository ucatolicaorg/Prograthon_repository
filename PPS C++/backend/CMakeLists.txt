cmake_minimum_required(VERSION 3.15)
project(ProgrammingContestAPI CXX)

# 1. Configuración básica
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")

# 2. Configuración flexible de vcpkg
if(DEFINED ENV{VCPKG_ROOT})
    set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake" CACHE STRING "Vcpkg toolchain file")
else()
    set(CMAKE_TOOLCHAIN_FILE "C:/vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "Vcpkg toolchain file")
endif()

# 3. Buscar dependencias principales
find_package(PostgreSQL REQUIRED)
find_package(jwt-cpp REQUIRED)
find_package(OpenSSL REQUIRED)  # Necesario para JWT y conexiones seguras

# 4. Búsqueda mejorada de Argon2
find_path(ARGON2_INCLUDE_DIR argon2.h
    PATHS ${CMAKE_PREFIX_PATH}/include
          ${VCPKG_INSTALLED_ROOT}/include
    PATH_SUFFIXES argon2
)

find_library(ARGON2_LIBRARY
    NAMES argon2 libargon2
    PATHS ${CMAKE_PREFIX_PATH}/lib
          ${VCPKG_INSTALLED_ROOT}/lib
)

if(NOT ARGON2_INCLUDE_DIR OR NOT ARGON2_LIBRARY)
    message(WARNING "Argon2 no encontrado. Intentando búsqueda alternativa...")
    
    # Búsqueda alternativa usando pkg-config
    find_package(PkgConfig)
    if(PKG_CONFIG_FOUND)
        pkg_check_modules(ARGON2 IMPORTED_TARGET libargon2)
        if(ARGON2_FOUND)
            set(ARGON2_INCLUDE_DIR ${ARGON2_INCLUDE_DIRS})
            set(ARGON2_LIBRARY ${ARGON2_LIBRARIES})
        endif()
    endif()
    
    if(NOT ARGON2_INCLUDE_DIR OR NOT ARGON2_LIBRARY)
        message(FATAL_ERROR "Argon2 no encontrado! Incluye: ${ARGON2_INCLUDE_DIR}, Librería: ${ARGON2_LIBRARY}")
    endif()
endif()

# 5. Configurar rutas de inclusión
include_directories(
    "${CMAKE_CURRENT_SOURCE_DIR}/include"
    "${CMAKE_CURRENT_SOURCE_DIR}/../include"  # Para httplib.h y json.hpp
    ${PostgreSQL_INCLUDE_DIRS}
    ${ARGON2_INCLUDE_DIR}
    ${OPENSSL_INCLUDE_DIR}
)

# 6. Recoger todos los archivos fuente
file(GLOB_RECURSE SOURCE_FILES 
    "src/*.cpp"
    "src/*.cxx"
    "src/*.cc"
)

# 7. Crear ejecutable
add_executable(server ${SOURCE_FILES})

# 8. Propiedades del objetivo
set_target_properties(server PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
    DEBUG_POSTFIX "_d"
    CXX_VISIBILITY_PRESET hidden
    VISIBILITY_INLINES_HIDDEN ON
)

# 9. Enlazar librerías
target_link_libraries(server PRIVATE
    ${PostgreSQL_LIBRARIES}
    ${ARGON2_LIBRARY}
    OpenSSL::SSL
    OpenSSL::Crypto
    ws2_32  # Winsock para Windows
    crypt32 # Crypto API para Windows
    jwt-cpp::jwt-cpp
)

# 10. Configuraciones para Windows
if(WIN32)
    target_compile_definitions(server PRIVATE
        _WIN32_WINNT=0x0A00  # Windows 10
        WIN32_LEAN_AND_MEAN
        NOMINMAX
    )
    
    # Enlazar librerías específicas de Windows
    target_link_libraries(server PRIVATE
        wsock32
        advapi32
    )
endif()

# 11. Instalación (opcional para despliegue)
install(TARGETS server
    RUNTIME DESTINATION bin
    CONFIGURATIONS Release
)

# 12. Configuración de pruebas (si las tienes)
enable_testing()
add_test(NAME ServerSmokeTest COMMAND server --test)