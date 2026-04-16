# AnotadorGym Web 🏋️‍♂️💻

Parte integral del ecosistema **AnotadorGym**, esta aplicación web desarrollada con **React 19** y **Vite** ofrece una interfaz moderna y eficiente para la gestión de rutinas y ejercicios, conectada a una API robusta en **.NET 9**.

## 🚀 Características Principales
- **Gestión Multiplataforma**: Sincronización total con la base de datos utilizada por la versión móvil (MAUI).
- **Sistema de Autenticación Completo**: Login con validación de credenciales y persistencia de sesión segura.
- **Autorización Basada en Roles (RBAC)**:
  - **Admin**: Acceso total a funcionalidades de gestión e información.
  - **Invitado**: Acceso de solo lectura a ejercicios y rutinas.
- **Interfaz Adaptativa**: Implementación de **Dark & Light Mode** para una mejor experiencia de usuario.

## 🛠️ Stack Tecnológico

- **React 19** & **Vite**: Desarrollo ágil y performance optimizada.
- **Tailwind CSS**: Diseño responsive y moderno mediante utilidades.
- **TypeScript**: Código robusto y mantenible con tipado estricto.
- **React Router**: Gestión de navegación SPA.
- **Lucide React**: Set de iconos vectoriales optimizado.

## 🏗️ Arquitectura y Funcionalidades Clave

### 🔒 Seguridad y Rutas Protegidas
 Se implementó una lógica de seguridad avanzada mediante dos mecanismos:

- **Protected Route**: Componente de alto orden (**HOC**) que envuelve páginas completas (como Importar Rutina), redirigiendo al login si no hay un token válido o el rol no es suficiente.
- **Protected Element**: Componentes que se renderizan condicionalmente según el **rol del usuario** (ej: un botón de "Eliminar" que solo ve el Admin).
- **Token JWT**: Manejo de autenticación con recepción de token, validación de expiración y almacenamiento de **Claims** (Roles).

### 📄 Páginas del Sistema
- **Ejercicios**: Listado completo con filtros, consumiendo datos directamente desde la API en **Render**.
- **Rutinas**: Visualización de planes de entrenamiento estructurados.
- **Importar Rutina** (Admin Only): Página exclusiva para la carga masiva de datos. Actualmente configurada para validar la funcionalidad de rutas protegidas antes de su implementación final.

### 🎨 Estilos y Temas
- **Index.css**: Configuración base de Tailwind y definición de variables de CSS para el manejo de temas.
- **DarkMode**: Implementación mediante clases de Tailwind controladas por un estado global, permitiendo un cambio fluido entre tema claro y oscuro.

## ⚙️ Configuración del Proyecto
**Variables de Entorno**
El proyecto utiliza un archivo .env (no incluido en el repositorio por seguridad) para configurar la conexión:

**Fragmento de código**
```env
VITE_API_URL=https://anotadorgymappapi.onrender.com/api
```
Se incluye un archivo .env.example como referencia.

**Instalación y Despliegue**

```bash
Clonar el repositorio.
# 1. Instalar dependencias
npm install
# 2. Ejecutar en modo desarrollo
npm run dev
# 3. Construir para producción
npm run build
```

## 🌐 Deploy
La aplicación se encuentra desplegada en Vercel, configurada con un archivo vercel.json para el manejo de rutas SPA (Rewrites) y asegurar que el refresco de página funcione correctamente en cualquier ruta.

**URL del Proyecto**: https://anotador-gym-web.vercel.app/

**Desarrollado por Lisandro Semperez** - Software Developer
