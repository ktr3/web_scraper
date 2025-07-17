# 📄 Aplicación de Web Scraping

Una aplicación moderna de scraping web con un frontend en React y un backend en Node.js que permite a los usuarios crear y gestionar tareas de scraping con una interfaz intuitiva.

## ✨ Funcionalidades

- **Panel moderno**: interfaz limpia y responsiva para gestionar tareas de scraping.
- **Monitoreo en tiempo real**: actualizaciones en vivo del estado de las tareas.
- **Configuración flexible**: soporte para selectores CSS personalizados y paginación.
- **Exportación de datos**: exporta resultados en formatos CSV o JSON.
- **Gestión de errores**: manejo robusto de errores y retroalimentación para el usuario.
- **Preparado para producción**: construido con TypeScript, validación adecuada y medidas de seguridad.

## 🛠️ Stack Tecnológico

### Frontend
- React 18 con TypeScript
- TailwindCSS para estilos
- React Router para navegación
- Lucide React para íconos

### Backend
- Node.js con Express y TypeScript
- Base de datos PostgreSQL
- Puppeteer para scraping
- Joi para validación
- Helmet para seguridad

## 🚀 Requisitos previos

- Node.js 18+ y npm
- PostgreSQL 12+
- Chrome/Chromium (para Puppeteer)

## 📋 Empezando

### 1. Configuración de la Base de Datos

Crea una base de datos PostgreSQL:

```sql
CREATE DATABASE webscraper;
2. Configuración del Backend
bash
Copiar
Editar
cd backend
npm install
cp .env.example .env
Edita .env con tu configuración de base de datos:

env
Copiar
Editar
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/webscraper
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
Inicia el backend:

bash
Copiar
Editar
npm run dev
3. Configuración del Frontend
bash
Copiar
Editar
npm install
npm run dev
La aplicación estará disponible en http://localhost:5173

🌐 Endpoints de la API
Tareas
POST /api/tasks - Crea una nueva tarea de scraping

GET /api/tasks - Lista todas las tareas

GET /api/tasks/:id - Obtiene detalles y resultados de una tarea

DELETE /api/tasks/:id - Elimina una tarea

GET /api/tasks/:id/export?format=csv|json - Exporta resultados de una tarea

Estado del servidor
GET /health - Estado de salud del servidor

📖 Uso
Crear una tarea: usa el panel para crear una tarea de scraping proporcionando:

URL objetivo

Selectores CSS para título y contenido

Opcional: configuración de paginación

Monitorear progreso: observa actualizaciones en tiempo real mientras tu tarea avanza.

Ver resultados: haz clic en cualquier tarea completada para ver los datos obtenidos de forma organizada.

Exportar datos: descarga los resultados en formato CSV o JSON para su análisis.

📝 Configuración de las Tareas
Selectores CSS
Proporciona selectores CSS para obtener el contenido que deseas:

Selector de título: .title, h1, #headline

Selector de contenido: .content, p, .description

Paginación
Activa el soporte de paginación para scraping en múltiples páginas:

Marca "Activar soporte de paginación"

Proporciona el selector para el botón "Siguiente": .next, [aria-label="Next"]

🧪 Desarrollo
Estructura del Proyecto
bash
Copiar
Editar
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── pages/               # Páginas principales
│   ├── hooks/               # Custom Hooks
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Utilidades

backend/
├── src/
│   ├── routes/              # Rutas API
│   ├── models/              # Modelos de base de datos
│   ├── services/            # Lógica de negocio
│   ├── middleware/          # Middlewares de Express
│   └── utils/               # Utilidades
Construcción para producción
Frontend:

bash
Copiar
Editar
npm run build
Backend:

bash
Copiar
Editar
cd backend
npm run build
npm start
🔐 Consideraciones de Seguridad
Validación de entradas con Joi

Prevención de SQL injection con consultas parametrizadas

Configuración de CORS

Cabeceras de seguridad con Helmet.js

Recomendaciones para limitación de tasa en producción

Protección de variables de entorno

🤝 Contribuciones
Haz un fork del repositorio

Crea una rama para tu feature

Realiza tus cambios y haz commit

Sube tu rama

Abre un Pull Request

📜 Licencia
Este proyecto está licenciado bajo la MIT License.
Puedes hacer lo que quieras con él, siempre que mantengas los créditos del autor original.