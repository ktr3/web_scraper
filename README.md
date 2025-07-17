# 🕷️ Web Scraper App

> Aplicación moderna de scraping web con dashboard, backend robusto, base de datos y scraping inteligente, inspirada en ScrapeGraphAI.

---

## 🚀 Características

- 📊 **Dashboard interactivo**: Administra tareas de scraping con una interfaz intuitiva.
- 🔄 **Monitorización en tiempo real**: Ve el estado de tus tareas en vivo.
- ✨ **Scraping inteligente**: Compatible con LLMs para extracción avanzada.
- 🔗 **Configuración flexible**: Selectores CSS y soporte para paginación.
- 📥 **Exportación de datos**: Resultados en JSON o CSV.
- 🛡️ **Robusto y seguro**: Validaciones, protección y manejo de errores.

---

## 🌐 Tecnologías

### Frontend

- React 18 + TypeScript
- TailwindCSS
- React Router
- Lucide React (iconos)

### Backend

- Node.js + Express + TypeScript
- PostgreSQL
- Puppeteer
- Joi (validación)
- Helmet (seguridad)

---

## ⚡ Instalación rápida

### 📦 Requisitos

- Node.js 18+
- PostgreSQL 12+
- Chrome/Chromium

### 📂 Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/webscraper
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Arranca el backend:

```bash
npm run dev
```

### 🖥️ Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📋 Endpoints API

- `POST /api/tasks` — Crear tarea de scraping
- `GET /api/tasks` — Listar tareas
- `GET /api/tasks/:id` — Ver detalle y resultados
- `DELETE /api/tasks/:id` — Eliminar tarea
- `GET /api/tasks/:id/export?format=csv|json` — Exportar resultados

---

## ✨ Uso

1️⃣ Crea una tarea desde el dashboard: URL, selectores CSS y paginación opcional.  
2️⃣ Monitoriza el progreso en tiempo real.  
3️⃣ Visualiza resultados.  
4️⃣ Exporta datos.

---

## 🗂️ Estructura del Proyecto

```
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
```

---

---

## 📜 Licencia

MIT © [KTR3](https://github.com/ktr3)

---

## ❤️ Agradecimientos

- Creado con ❤️ por [KTR3](https://github.com/ktr3)
