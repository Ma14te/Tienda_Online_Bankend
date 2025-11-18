const { Pool } = require('pg');
require('dotenv').config();

// Configuración usando la URL de conexión (DATABASE_URL)
const connectionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones externas a Railway/Render/etc.
  }
};

// Si no existe DATABASE_URL, intentamos usar las variables individuales (para local)
if (!process.env.DATABASE_URL) {
  connectionConfig.user = process.env.DB_USER;
  connectionConfig.host = process.env.DB_HOST;
  connectionConfig.database = process.env.DB_DATABASE;
  connectionConfig.password = process.env.DB_PASSWORD;
  connectionConfig.port = process.env.DB_PORT;
  // Quitamos SSL si estamos en local (opcional)
  delete connectionConfig.connectionString;
  delete connectionConfig.ssl;
}

const pool = new Pool(connectionConfig);

module.exports = pool;