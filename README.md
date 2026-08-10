# Aerolinea App

Aplicación web de reserva de vuelos con frontend en React/Vite y backend en Express + MySQL.

## Descripción

Este proyecto incluye una pequeña aerolínea digital donde los usuarios pueden buscar vuelos, iniciar sesión, registrarse, ver sus reservas y realizar check-in. El panel de administración permite crear vuelos y ver reservas. La aplicación está separada en dos carpetas principales:

- `backend/`: API REST en Node.js con Express, JWT y MySQL.
- `frontend/`: SPA React creada con Vite.

## Tecnologías principales

- Node.js
- Express
- MySQL
- React
- Vite
- Axios
- Bootstrap
- JWT para autenticación
- `concurrently` para ejecutar frontend y backend juntos

## Estructura del repositorio

```
/aerolinea-app
├─ backend
│  ├─ app.js
│  ├─ seed.js
│  ├─ package.json
│  ├─ .env           # NO incluido en el repositorio
│  ├─ config/db.js
│  ├─ middleware/auth.js
│  ├─ routes/auth.js
│  ├─ routes/vuelos.js
│  ├─ routes/reservas.js
│  └─ README.md
├─ frontend
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ public/
│  └─ src/
│     ├─ App.jsx
│     ├─ main.jsx
│     ├─ index.css
│     ├─ components/
│     └─ pages/
├─ package.json
├─ package-lock.json
└─ README.md
```

## Requisitos previos

1. Tener instalado Node.js (versión compatible con Vite y Express).
2. Tener un servidor MySQL en ejecución.
3. Crear una base de datos MySQL vacía o dejar que el script `seed.js` la cree.

## Configuración del backend

1. Copia el archivo de ejemplo o crea `backend/.env`.
2. Define los valores de conexión a MySQL y la clave JWT.

Ejemplo `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password
DB_NAME=aerolinea
JWT_SECRET=una_clave_segura
PORT=5000
```

> **Importante:** `backend/.env` está excluido del control de versiones y no debe subirse al repositorio.

## Instalación y ejecución

Desde la raíz del repositorio:

```bash
cd aerolinea-app
npm install
```

Luego instala dependencias de cada parte:

```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Crear datos de prueba

Ejecuta el seed para crear la base de datos, las tablas y datos iniciales:

```bash
cd backend
npm run seed
```

### Ejecutar la aplicación completa

Desde la raíz del proyecto:

```bash
npm run dev
```

Esto iniciará simultáneamente:

- Backend en `http://localhost:5000`
- Frontend en `http://localhost:5173`

## Scripts disponibles

### Raíz

- `npm run dev`: inicia backend y frontend a la vez usando `concurrently`.

### Backend

- `npm start`: arranca el servidor Express.
- `npm run seed`: ejecuta `seed.js` para preparar la base de datos.

### Frontend

- `npm run dev`: inicia el servidor de desarrollo de Vite.
- `npm run build`: genera la versión de producción.
- `npm run preview`: previsualiza el build de producción.

## Endpoints principales del backend

| Método | Ruta               | Descripción                                |
| ------ | ------------------ | ------------------------------------------ |
| POST   | `/api/auth/register` | Registrar usuario                          |
| POST   | `/api/auth/login`    | Iniciar sesión y obtener JWT               |
| GET    | `/api/vuelos`        | Listar vuelos                              |
| POST   | `/api/vuelos`        | Crear un nuevo vuelo (admin)               |
| POST   | `/api/reservas`      | Crear una reserva                          |
| GET    | `/api/reservas/mis-reservas` | Obtener reservas del usuario autenticado |
| DELETE | `/api/reservas/:id`  | Cancelar una reserva                       |

## Funcionalidades disponibles

- Buscador de vuelos.
- Reserva de vuelos con usuario autenticado.
- Gestión de reservas del usuario.
- Pantalla de check-in con pase de abordar simulado.
- Panel administrativo para crear vuelos y revisar reservas.
- Conmutador de idioma en el frontend.

## Notas adicionales

- El frontend consume la API en `http://localhost:5000/api`.
- El proyecto está configurado para desarrollo local.
- Si el puerto `5173` ya está en uso, Vite podrá levantar el frontend en otro puerto automáticamente.

## Enlace al repositorio

https://github.com/KamiloVelasquez/aerolinea-app
