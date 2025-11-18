/*
* ARCHIVO MODIFICADO: src_bankend/app.js
*/

const express = require('express');
const cors = require('cors');
const path = require('path');

const ensureDefaultAdmin = require('./utils/ensureDefaultAdmin');

const app = express();

// ensureDefaultAdmin(); // <-- ¡MODIFICACIÓN! Esta línea ha sido comentada.

// CORS actualizado para Angular
const corsOptions = {
  origin: ['http://localhost:4200', 'https://tiendaonlinebankend-production.up.railway.app/'], // Permitir ambos puertos
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Importante para enviar cookies/headers
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json({ strict: false }));

// COMENTAR O ELIMINAR estas líneas (ya no servimos el frontend antiguo)
// app.use(express.static(path.join(__dirname, '../../frontend')));

// Rutas de la API
const usuariosRoutes = require('./routes/usuarios');
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const pedidosRoutes = require('./routes/pedidos');
const imagenesRoutes = require('./routes/imagenes');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/imagenes', imagenesRoutes);

// ELIMINAR o COMENTAR el catch-all del frontend antiguo
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../frontend', 'index.html'));
// });

// Opcional: Endpoint de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando' });
});

module.exports = app;