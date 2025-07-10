@echo off
echo Limpiando compilaciones anteriores...
if exist build (
    rmdir /s /q build
)

echo.
echo Configuracion del proyecto con CMake...
echo Usando el toolchain de vcpkg...

:: Crear carpeta de build y ejecutar CMake para generar los archivos de compilacion (usando MinGW Makefiles).
:: La parte clave es -DCMAKE_TOOLCHAIN_FILE, que le dice a CMake como encontrar las librerias de vcpkg.
cmake -G "MinGW Makefiles" -B build -S . -DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake

echo.
echo Compilando el proyecto...

:: Ejecutar el proceso de compilacion.
cmake --build build

echo.
echo Proceso de compilacion finalizado.
echo El ejecutable 'server.exe' se encuentra en la carpeta 'build'.
echo Para iniciar el servidor, ejecuta:
echo cd build
echo server.exe