// netlify/functions/convert-temperature.js
// Endpoint: GET /api/convert-temperature?value=100&from=celsius&to=fahrenheit

const validUnits = ["celsius", "kelvin", "fahrenheit"];

const unitNames = {
  celsius: "celsius",
  kelvin: "kelvin",
  fahrenheit: "fahrenheit",
};

/**
 * Convierte una temperatura desde cualquier unidad soportada a cualquier otra.
 * Estrategia: convertir primero a Celsius (unidad base), luego a la unidad destino.
 */
function convertTemperature(value, from, to) {
  // Paso 1: Convertir a Celsius
  let celsius;
  switch (from) {
    case "celsius":
      celsius = value;
      break;
    case "kelvin":
      celsius = value - 273.15;
      break;
    case "fahrenheit":
      celsius = (value - 32) * (5 / 9);
      break;
    default:
      return null;
  }

  // Paso 2: Convertir de Celsius a la unidad destino
  let result;
  let formula;
  switch (to) {
    case "celsius":
      result = celsius;
      if (from === "celsius") formula = "value";
      else if (from === "kelvin") formula = "value - 273.15";
      else if (from === "fahrenheit") formula = "(value - 32) * (5 / 9)";
      break;
    case "kelvin":
      result = celsius + 273.15;
      if (from === "kelvin") formula = "value";
      else if (from === "celsius") formula = "value + 273.15";
      else if (from === "fahrenheit")
        formula = "(value - 32) * (5 / 9) + 273.15";
      break;
    case "fahrenheit":
      result = celsius * (9 / 5) + 32;
      if (from === "fahrenheit") formula = "value";
      else if (from === "celsius") formula = "value * (9 / 5) + 32";
      else if (from === "kelvin")
        formula = "(value - 273.15) * (9 / 5) + 32";
      break;
  }

  return { result, formula };
}

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const { value, from, to } = event.queryStringParameters || {};

    // Validar que los parámetros existan
    if (value === undefined || from === undefined || to === undefined) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Parámetros faltantes",
          message:
            "Se requieren los parámetros: value, from y to. Ejemplo: ?value=100&from=celsius&to=fahrenheit",
        }),
      };
    }

    const numValue = parseFloat(value);

    // Validar que value sea un número
    if (isNaN(numValue)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Valor inválido",
          message: `El valor '${value}' no es un número válido`,
        }),
      };
    }

    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();

    // Validar unidades
    if (!validUnits.includes(fromLower)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Unidad no válida",
          message: `La unidad '${from}' no está soportada. Unidades válidas: ${validUnits.join(", ")}`,
        }),
      };
    }

    if (!validUnits.includes(toLower)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Unidad no válida",
          message: `La unidad '${to}' no está soportada. Unidades válidas: ${validUnits.join(", ")}`,
        }),
      };
    }

    const conversion = convertTemperature(numValue, fromLower, toLower);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          value: numValue,
          from: unitNames[fromLower],
          to: unitNames[toLower],
          result: parseFloat(conversion.result.toFixed(4)),
          formula: conversion.formula,
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error interno del servidor",
        message: error.message,
      }),
    };
  }
};
