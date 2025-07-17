🕷️ Web Scraper App

Una aplicación moderna de scraping web con dashboard, backend robusto y base de datos, lista para producción.

🚀 Características

📊 Dashboard moderno: Interfaz limpia y responsive para gestionar tareas de scraping.

🔄 Monitorización en tiempo real: Estado en vivo de las tareas.

🔗 Configuración flexible: Soporte para selectores CSS y paginación.

📥 Exportación de datos: CSV o JSON.

🛡️ Manejo de errores y seguridad.

🧹 Scraping robusto: Puppeteer para scraping real y controlado.

🌐 Tecnologías

Frontend

React 18 + TypeScript

TailwindCSS

React Router

Lucide React (iconos)

Backend

Node.js + Express + TypeScript

PostgreSQL

Puppeteer

Joi (validación)

Helmet (seguridad)

🚀 Instalación rápida

📦 Requisitos

Node.js 18+

PostgreSQL 12+

Chrome/Chromium

📂 Backend

cd backend
npm install
cp .env.example .env

Configura tu .env con las credenciales de tu base de datos:

DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/webscraper
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

Arranca el backend:

npm run dev

🖥️ Frontend

cd frontend
npm install
npm run dev

Disponible en: http://localhost:5173

📋 Endpoints API

POST /api/tasks — Crear tarea de scraping

GET /api/tasks — Listar tareas

GET /api/tasks/:id — Ver detalle y resultados

DELETE /api/tasks/:id — Eliminar tarea

GET /api/tasks/:id/export?format=csv|json — Exportar resultados

✨ Uso

1️⃣ Crea una tarea desde el dashboard: define la URL objetivo, selectores CSS y configuración opcional de paginación.2️⃣ Monitoriza el progreso en tiempo real.3️⃣ Visualiza los resultados directamente en la app.4️⃣ Exporta los datos.

🗂️ Estructura del Proyecto

frontend/
├── components/
├── pages/
├── hooks/
├── types/
├── utils/
├── App.tsx
├── main.tsx

backend/
├── src/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── index.ts

📜 Licencia

MIT © KTR3

Creado con ❤️ por KTR3.

