const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API Documentation",
      version: "1.0.0",
      description: "API documentation for the Express.js application",
    },
    servers: [
      {
        url: "http://localhost:3001", // Replace with your server URL
      },
    ],
  },
  apis: ["./services/*.js"], // Specify the path where API route comments are written
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
