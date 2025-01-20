const serverless = require("serverless-http");
const app = require("../../index"); // Import your express app

module.exports.handler = serverless(app); // Wrap your app using serverless-http
