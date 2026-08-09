# Aerolinea App

## Requisitos
- Node.js
- MySQL Server en ejecución

## Arranque rápido

1. Instala las dependencias:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Configura la base de datos editando `backend/.env` con tus credenciales MySQL.

3. Ejecuta el seed (crea la BD, tablas y datos de prueba):
   ```bash
   cd backend
   node seed.js
   ```

4. Inicia el proyecto (desde la raíz):
   ```bash
   npm run dev
   ```

5. Abre en el navegador:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173
