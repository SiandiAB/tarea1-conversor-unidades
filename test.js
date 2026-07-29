// test.js — Script para probar las funciones localmente sin Netlify CLI

const convertDistance = require("./netlify/functions/convert-distance");
const convertTemperature = require("./netlify/functions/convert-temperature");
const convertWeight = require("./netlify/functions/convert-weight");

async function test(endpoint, fn, params) {
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const event = {
    queryStringParameters: params,
    rawUrl: `http://localhost:8888/${endpoint}?${queryString}`,
  };

  const response = await fn.handler(event);
  const body = JSON.parse(response.body);

  console.log(`\n📡 GET /${endpoint}?${queryString}`);
  console.log(`   Status: ${response.statusCode}`);
  console.log(`   Response:`, JSON.stringify(body, null, 2));
}

(async () => {
  console.log("🧪 Probando API de Conversión de Unidades\n");
  console.log("=".repeat(60));

  // --- Distancia ---
  await test("api/convert-distance", convertDistance, {
    value: "5",
    from: "kilometros",
    to: "millas",
  });
  await test("api/convert-distance", convertDistance, {
    value: "100",
    from: "metros",
    to: "pies",
  });
  await test("api/convert-distance", convertDistance, {
    value: "10",
    from: "pulgadas",
    to: "centimetros",
  });

  // --- Temperatura ---
  await test("api/convert-temperature", convertTemperature, {
    value: "25",
    from: "celsius",
    to: "fahrenheit",
  });
  await test("api/convert-temperature", convertTemperature, {
    value: "300",
    from: "kelvin",
    to: "celsius",
  });
  await test("api/convert-temperature", convertTemperature, {
    value: "0",
    from: "celsius",
    to: "kelvin",
  });

  // --- Peso ---
  await test("api/convert-weight", convertWeight, {
    value: "50",
    from: "kilos",
    to: "libras",
  });
  await test("api/convert-weight", convertWeight, {
    value: "1000",
    from: "gramos",
    to: "kilos",
  });
  await test("api/convert-weight", convertWeight, {
    value: "2",
    from: "toneladas métricas",
    to: "kilos",
  });

  // --- Errores ---
  console.log("\n" + "=".repeat(60));
  console.log("🧪 Probando casos de error\n");

  await test("api/convert-distance", convertDistance, {
    value: "abc",
    from: "kilometros",
    to: "millas",
  });
  await test("api/convert-weight", convertWeight, {
    value: "-10",
    from: "kilos",
    to: "libras",
  });
  await test("api/convert-temperature", convertTemperature, {
    value: "100",
    from: "celsius",
    to: "rankine",
  });

  console.log("\n✅ Todas las pruebas completadas.");
})();
