# Backend — Aerolinea App

API REST con Express y MySQL. Al iniciar, el servidor crea la base de datos configurada y las tablas `usuarios`, `vuelos` y `reservas` si aún no existen. La cuenta MySQL de `backend/.env` necesita permiso para crear la base de datos la primera vez.

## Preparar la base de datos y crear una cuenta desde la web

1. Instala e inicia MySQL Server.
2. Copia `backend/.env.example` a `backend/.env` y configura `DB_HOST`, `DB_PORT`, `DB_USER` y `DB_PASS` con las credenciales reales de MySQL. Cambia también `JWT_SECRET` por una clave larga y privada.
3. Desde la carpeta raíz del proyecto, instala dependencias una vez con `npm install` en `backend` y `frontend`.
4. Arranca backend y frontend con `npm run dev` desde la raíz del proyecto.
5. Abre `http://localhost:5173/register`, crea la cuenta y luego inicia sesión. El backend valida los datos, guarda el usuario en MySQL y almacena la contraseña como hash bcrypt. Los registros públicos siempre reciben rol de usuario.

El backend solo inicia cuando puede conectar con MySQL y preparar el esquema; si MySQL no está iniciado o las credenciales son incorrectas, mostrará el error en la terminal. Si la cuenta MySQL no tiene permiso `CREATE DATABASE`, crea la base `aerolinea` manualmente y vuelve a iniciar el servidor.

## Configuración

Variables de entorno en `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_password
DB_NAME=aerolinea
JWT_SECRET=una_clave_segura_y_privada
PORT=5000
```

Para producción, define `VITE_API_URL` en el frontend con la URL pública del backend (sin `/api` al final) y configura el alojamiento para que `/api` llegue a ese backend. No guardes credenciales de MySQL en el frontend ni subas archivos `.env` al repositorio.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Crear cuenta de usuario |
| POST | `/api/auth/login` | Iniciar sesión y devolver JWT |
| GET | `/api/vuelos` | Listar vuelos |
| POST | `/api/vuelos` | Crear vuelo |
| POST | `/api/reservas` | Crear reserva |
