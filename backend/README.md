# Backend — Aerolinea App

API REST con Express + MySQL.

## Configuración

Edita `.env` con tus credenciales:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password
DB_NAME=aerolinea
JWT_SECRET=una_clave_segura
PORT=5000
```

## Comandos

```bash
npm install       # Instalar dependencias
node seed.js      # Crear BD, tablas y datos de prueba
npm start         # Iniciar servidor en puerto 5000
```

## Endpoints

| Método | Ruta              | Descripción           |
|--------|-------------------|-----------------------|
| POST   | /api/auth/register | Registrar usuario    |
| POST   | /api/auth/login    | Login (devuelve JWT) |
| GET    | /api/vuelos        | Listar vuelos        |
| POST   | /api/vuelos        | Crear vuelo          |
| POST   | /api/reservas      | Crear reserva        |
