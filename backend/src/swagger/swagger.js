const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NorthAmulet API',
      version: '1.0.0',
      description: 'REST API สำหรับระบบ Marketplace พระเครื่องออนไลน์ NorthAmulet',
    },
    servers: [
      {
        url: '/api',
        description: 'API Base Path',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },

  apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJSDoc(options);