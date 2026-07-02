require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 NorthAmulet API running on port ${PORT}`);
  console.log(`📚 Swagger Docs : http://localhost:${PORT}/api-docs`);
});