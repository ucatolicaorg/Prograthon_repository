# 🚀 Prograthon

**Prograthon** es tu compañero definitivo para planificar, seguir y mejorar tus maratones de programación. Con una interfaz web moderna y herramientas potentes, te permitirá concentrarte en lo que más importa: ¡codificar!



## 🌟 Características principales

- **Seguimiento en tiempo real**  
  Visualiza el progreso de cada participante y equipo durante la maratón: problemas resueltos, tiempo empleado y puntuación acumulada.

- **Gestión de retos**  
  Crea, edita y organiza desafíos de distintos niveles de dificultad (fácil, medio, difícil) con descripciones detalladas y casos de prueba configurables.

- **Tablas de clasificación dinámicas**  
  Clasificaciones globales, por equipo o individuales, ordenadas por puntos y tiempo de entrega.

- **Notificaciones y alertas**  
  Recibe avisos automáticos cuando se acerquen los plazos de entrega o cuando se publiquen nuevos retos.

- **Perfil de usuario personalizable**  
  Cada participante puede completar su perfil, ver estadísticas históricas y compararse con sus registros anteriores.



## 🛠️ Tecnologías

Prograthon está construido sobre la pila **MERN** y algunas herramientas adicionales:

- **MongoDB** para almacenamiento de datos  
- **Express.js** como servidor HTTP  
- **React.js** para una interfaz de usuario ágil e interactiva  
- **Node.js** para la lógica de backend  
- **JavaScript**, **HTML5** y **CSS3** para la experiencia web  
- **C++** para la ejecución de algoritmos potentes y funcionales

---  

# Ejecución del proyecto

## Índice
- [Requisitos](#Requisitos)
- [Configuración del entorno de desarrollo](#Configuración-del-entorno-de-desarrollo)

## Requisitos

- Node.js

    Descarga el instalador oficial desde: https://nodejs.org/en

- npm y git

    Son complementarios, puedes comprobar si los tienes con los comandos:

        npm -v
        git -v

> [!TIP]
> En algunos casos ```npm``` no esta configurado como scripts de PowerShell firmados, en esos casos es necesario ejecutar la terminal como administrador para ejecutar scripts de PowerShell no firmados, mediante ```Set-ExecutionPolicy RemoteSigned```, seleccionando ```si```.
    

## Configuración del entorno de desarrollo

Este conjunto de comandos configura un stack mern completo para:
  - Backend Node.js/Express con MongoDB
  - Frontend React con Vite
  - Estilos con Tailwind CSS
  - Enrutamiento con React Router
  - Configuración CORS para comunicación entre frontend y backend
<br/>

1. Backend y dependencias base

        npm install mongodb express cors

    - **mongodb**: Controlador oficial de MongoDB para Node.js (para interactuar con bases de datos MongoDB)
    - **express**: Framework web para Node.js (para crear APIs y servidores web)
    - **cors**: Middleware para habilitar CORS (Cross-Origin Resource Sharing)

2. Creación de frontend con Vite + React

        npm create vite@latest client -- --template 

    - Crea un nuevo proyecto React usando Vite (herramienta de build moderna)
    - Nombre del proyecto: `client`
    - Usa la plantilla oficial de React

3. Instalar dependencias del frontend

        cd client
        npm install

    - Instala todas las dependencias del proyecto React creado por Vite:
        - react
        - react-dom
        - @vitejs/plugin-react
        - etc.

4. Configuración de Tailwind CSS

        npm install -D tailwindcss postcss autoprefixer

    - **tailwindcss**: Framework CSS utility-first
    - **postcss**: Herramienta de transformación CSS
    - **autoprefixer**: Plugin para agregar prefijos de vendedores CSS
    - ```-D```: Instala como dependencias de desarrollo

5. Inicializar Tailwind

        npx tailwindcss init -p

    - Crea archivo de configuración ```tailwind.config.js```
    - ```-p```: Crea también ```postcss.config.js```
    - Configura la integración con PostCSS

6. React Router (enrutamiento)

        npm install -D react-router-dom

    - **react-router-dom**: Biblioteca de enrutamiento para React (v6.x)
    - Permite crear navegación entre componentes/páginas
    - (Nota: Aunque se usa ```-D```, normalmente sería dependencia regular)
---
# 📦 Instalación de **cpp-httplib** para C++

Esta guía te llevará paso a paso por el proceso de poner a punto **cpp-httplib**, un framework ligero de HTTP/HTTPS en un solo archivo de cabecera, para tus proyectos en C++.

---

## 📝 Requisitos previos

- **Compilador C++** compatible con C++11 o superior (g++, clang++, MSVC).
- Conexión a Internet para descargar el archivo de cabecera.
- (Opcional) **CMake** o gestor de paquetes como **vcpkg** si prefieres integrarlo en tu flujo de trabajo.

---

## 🔍 1. Obtener el archivo de cabecera

cpp-httplib está distribuido como un único archivo `httplib.h`. Tienes dos opciones:

1. **Descarga directa**  
   - Ve a la página oficial en GitHub:  
     ```
     https://github.com/yhirose/cpp-httplib
     ```
   - Haz clic en “Raw” sobre el archivo `httplib.h` y guarda su contenido en tu proyecto, por ejemplo en `include/httplib.h`.

2. **Clonar el repositorio**  
   ```bash
   git clone https://github.com/yhirose/cpp-httplib.git
   cd cpp-httplib
   # Copia httplib.h a tu carpeta de include
   cp single_include/httplib.h /ruta/a/tu/proyecto/include/


<h4 align="center">
:construction: Proyecto en desarrollo y producción :construction:
</h4>
