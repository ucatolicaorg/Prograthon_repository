@echo off
setlocal enabledelayedexpansion

echo Limpiando compilaciones anteriores...
if exist build (
    rmdir /s /q build
)

echo.
echo Configurando entorno de compilación...

:: Usar variable de entorno si existe, sino ruta por defecto
set DEFAULT_VCPKG=C:\vcpkg
if defined VCPKG_ROOT (
    set VCPKG_ROOT=!VCPKG_ROOT!
) else if defined VCPKG_INSTALLATION_ROOT (
    set VCPKG_ROOT=!VCPKG_INSTALLATION_ROOT!
) else (
    set VCPKG_ROOT=!DEFAULT_VCPKG!
)

:: Verificar existencia de vcpkg
if not exist "!VCPKG_ROOT!\vcpkg.exe" (
    echo Error: vcpkg no encontrado en !VCPKG_ROOT!
    echo Instale vcpkg o configure VCPKG_ROOT/VCPKG_INSTALLATION_ROOT
    exit /b 1
)

:: Configurar CMake
echo.
echo Configurando proyecto con CMake...
echo [Usando toolchain de vcpkg: !VCPKG_ROOT!]

cmake -B build -S . ^
    -DCMAKE_TOOLCHAIN_FILE="!VCPKG_ROOT!/scripts/buildsystems/vcpkg.cmake" ^
    -DCMAKE_BUILD_TYPE=Release

if %errorlevel% neq 0 (
    echo Error en la configuracion CMake
    exit /b 1
)

echo.
echo Compilando el proyecto...
cmake --build build --config Release --parallel 4

if %errorlevel% neq 0 (
    echo Error en la compilacion
    exit /b 1
)

echo.
echo Proceso de compilacion finalizado correctamente.
echo El ejecutable 'server.exe' se encuentra en 'build\bin'
echo Para iniciar el servidor: 
echo   cd build\bin
echo   server.exe

endlocal