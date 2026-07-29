// server.js — Servidor local para probar las funciones en /api/*
// Ejecutar: node server.js
// Luego visitar: http://localhost:8888/api/convert-distance?value=5&from=kilometros&to=millas

const express = require("express");
const convertDistance = require("./netlify/functions/convert-distance");
const convertTemperature = require("./netlify/functions/convert-temperature");
const convertWeight = require("./netlify/functions/convert-weight");

const app = express();
const PORT = process.env.PORT || 8888;

// Wrapper que adapta una Netlify Function handler a un middleware de Express
function netlifyToExpress(handler) {
  return async (req, res) => {
    const event = {
      queryStringParameters: req.query,
      rawUrl: req.originalUrl,
    };
    const response = await handler.handler(event);
    res.status(response.statusCode).set(JSON.parse(JSON.stringify(response.headers || {}))).json(JSON.parse(response.body));
  };
}

// Montar funciones en las rutas /api/*
app.get("/api/convert-distance", netlifyToExpress(convertDistance));
app.get("/api/convert-temperature", netlifyToExpress(convertTemperature));
app.get("/api/convert-weight", netlifyToExpress(convertWeight));

// Ruta raíz informativa
app.get("/", (req, res) => {
  res.json({
    name: "API de Conversión de Unidades",
    version: "1.0.0",
    endpoints: {
      distancia: "/api/convert-distance?value=5&from=kilometros&to=millas",
      temperatura: "/api/convert-temperature?value=25&from=celsius&to=fahrenheit",
      peso: "/api/convert-weight?value=50&from=kilos&to=libras",
    },
    unidades: {
      distancia: ["metros", "kilometros", "centimetros", "millas", "yardas", "pies", "pulgadas"],
      temperatura: ["celsius", "kelvin", "fahrenheit"],
      peso: ["kilos", "gramos", "toneladas métricas", "libras", "onzas"],
    },
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor local corriendo en http://localhost:${PORT}`);
  console.log("   Endpoints disponibles:\n");
  console.log(`   📏 Distancia:    http://localhost:${PORT}/api/convert-distance?value=5&from=kilometros&to=millas`);
  console.log(`   🌡️  Temperatura:  http://localhost:${PORT}/api/convert-temperature?value=25&from=celsius&to=fahrenheit`);
  console.log(`   ⚖️  Peso:         http://localhost:${PORT}/api/convert-weight?value=50&from=kilos&to=libras\n`);
});
