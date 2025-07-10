# 🚀 Prograthon

**Prograthon** es tu compañero definitivo para planificar, seguir y mejorar tus maratones de programación. Con una interfaz web moderna y herramientas potentes, te permitirá concentrarte en lo que más importa: ¡codificar!

---

## 🎯 Público objetivo

Este proyecto está dirigido a los **estudiantes de la Universidad Católica de Colombia** interesados en fortalecer sus habilidades en **programación competitiva**. A través de un entorno práctico con funcionalidades de maratones, seguimiento de desempeño y gestión de usuarios por rol, se busca fomentar la participación activa, el aprendizaje autónomo y el desarrollo de competencias clave en resolución de problemas algorítmicos.

---

## 🌟 Características principales

- **Gestión de usuarios por roles**  
  Permite registrar y autenticar estudiantes, profesores y un administrador general, cada uno con distintos niveles de acceso y permisos dentro del sistema.

- **Autenticación segura con JWT y Argon2**
  Implementación robusta de seguridad para login y registro: las contraseñas se almacenan de forma cifrada con Argon2 y las sesiones se manejan mediante tokens JWT generados y verificados desde la API en C++.

- **API REST eficiente desarrollada en C++**
  El backend se desarrolla usando la librería cpp-httplib, lo que permite manejar peticiones HTTP (GET, POST, etc.) de forma liviana, rápida y modular.

- **Base de datos PostgreSQL**
  Toda la información del sistema (usuarios, maratones, inscripciones) se almacena y gestiona con PostgreSQL, una base de datos relacional robusta y de alto rendimiento, integrada con C++ mediante libpq.

- **Frontend moderno con React**
  El cliente web está construido con React, usando componentes reutilizables y enrutamiento dinámico con react-router-dom para una experiencia fluida tipo SPA (Single Page Application).

- **Sistema de maratones**
  Los profesores y administradores pueden crear nuevas maratones de programación, y los estudiantes pueden inscribirse desde la plataforma web. Cada maratón puede tener restricciones y configuraciones específicas.

- **Gestión de retos**  
  Crea, edita y organiza desafíos de distintos niveles de dificultad (fácil, medio, difícil) con descripciones detalladas y casos de prueba configurables.

- **Compilación y automatización multiplataforma**
  Uso de CMake y build.bat para automatizar la generación y construcción del proyecto C++ desde terminal, facilitando el desarrollo, pruebas y despliegue.

- **Gestion de dependencias con vcpkg**
  Todas las bibliotecas externas necesarias (como httplib, json, libpq, jwt-cpp, argon2) son instaladas y administradas eficientemente con vcpkg, garantizando portabilidad y mantenibilidad.
  
---

## 🛠️ Tecnologías

- **C++**  
- **PostgreSQL**  
- **cpp-httplib** (httplib.h + json.hpp)  
- **libpq**  
- **vcpkg**  
- **CMake**  
- **g++ (MingW64)**  
- **React** 
- **jwt-cpp**  
- **argon2**  

---

# 🚀 ¡Instalación del Proyecto!

## 📑 Índice
- [🎯 Requisitos](#requisitos)  
- [⚙️ Configuración del entorno de desarrollo](#configuración-del-entorno-de-desarrollo)  
- [🏗️ Backend](#backend)  
- [⚛️ Frontend](#frontend)    
- [✅ Finalizar](#finalizar)  

---

## 🎯 Requisitos

- **vcpkg**  
  Gestor de paquetes para C++ (Windows).  
- **CMake**  
  Generación de proyectos y Makefiles.  
- **g++ (MingW64)**  
  Compilador C++ compatible con C++11+.  
- **Node.js y npm**  
  Para el frontend en React.  

> [!💡 TIP]  
> Si PowerShell bloquea scripts npm, abre la terminal como administrador y ejecuta `Set-ExecutionPolicy RemoteSigned`.  

---

## ⚙️ Configuración del entorno de desarrollo

1. Clonar repositorio (carpeta PPS C++) y prepararlo  
        
        git clone https://github.com/tu-usuario/tu-repositorio.git
        cd tu-repositorio

    - **Repositorio**: Código fuente del backend y frontend.

2. Configurar vcpkg  
        
        cd vcpkg
        .\bootstrap-vcpkg.bat
        .\vcpkg integrate install

    - **vcpkg**: Instalación y configuración global.

3. Instalar dependencias C++ vía vcpkg  
        
        vcpkg install libpq:x64-windows
        vcpkg install nlohmann-json:x64-windows
        vcpkg install httplib:x64-windows
        vcpkg install jwt-cpp:x64-windows
        vcpkg install argon2:x64-windows

    - **libpq**: Adaptador PostgreSQL.  
    - **nlohmann-json**: Manejo de JSON.  
    - **cpp-httplib**: Servidor HTTP/HTTPS.  
    - **jwt-cpp**: JWT en C++.  
    - **argon2**: Algoritmo de hash seguro.


4. Instalar Cmake y MINGW64

**MingW64** es un entorno GCC para Windows que te permite compilar proyectos en C y C++ usando g++/gcc y utilidades POSIX.

## 🌟 Características principales

- **Compilador g++/gcc**  
  Compatible con C++11+ y bibliotecas estándar GNU.  
- **Entorno POSIX**  
  Incluye bash, make, autotools y más.  
- **Ligero y portable**  
  Instalación mínima y configuración sencilla.

## 🛠️ Instalación y uso

1) Descarga el instalador oficial desde https://mingw-w64.org/doku.php/download  

2) Ejecuta el instalador:  
   - Arquitectura: x86_64  
   - Threads: win32  
   - Exception: seh  
   - Ruta: `C:\mingw64`  

3) Agrega `C:\mingw64\bin` al `PATH` de Windows.  

4) Verifica la instalación:  
   ```bash
   g++ --version
   gcc --version

5) Compila el codigo
   ```bash
   g++ -std=c++17 main.cpp -o main.exe
   
6) Ejecuta el binario
   ```bash
   ./main.exe

---

**CMake** es una herramienta multiplataforma para generar Makefiles y proyectos para diversos IDEs y sistemas de construcción.


## 🌟 Características principales

- **Multiplataforma**  
  Soporta Windows, Linux y macOS.  
- **Generación de proyectos**  
  Integración con Visual Studio, Ninja, Makefiles y más.
- **Configuración modular**  
  Archivos CMakeLists.txt personalizables.

## 🛠️ Instalación y uso

1) Descarga el instalador de windows oficial desde https://cmake.org/download/ 

2) Ejecuta el instalador   

3) Marca “Add CMake to the system PATH”.  

4) Verifica la instalación:  
   ```bash
   cmake --version

5) En tu proyecto
   ```bash
   mkdir build && cd build
   cmake ..
   
6) Compila el proyecto
   ```bash
   cmake --build .

7) Ejecuta el ejecutable
   ```bash
   ./TuEjecutable.exe

---

5. Construir el backend  
        
        build.bat

    - Crea carpeta `build/`.  
    - Genera `server.exe` usando CMake y g++.

---

6. Ejecutar la API  
        
        cd build
        .\server.exe

    - La API estará activa en `http://localhost:8080`.

---

7. Configurar y ejecutar el frontend  
        
        cd frontend
        npx create-react-app .
        npm install react-router-dom
        npm start

    - La aplicación React correrá en `http://localhost:3000`.  

---

## ✅ Finalizar
