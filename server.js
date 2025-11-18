const app = require('./src/app');
require('dotenv').config();
const ensureDefaultAdmin = require('./src/utils/ensureDefaultAdmin');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  await ensureDefaultAdmin();
});
