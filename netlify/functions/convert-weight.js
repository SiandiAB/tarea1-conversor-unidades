// netlify/functions/convert-weight.js
// Endpoint: GET /api/convert-weight?value=10&from=kilos&to=libras

// Factores de conversión: todas las unidades se convierten primero a gramos (unidad base)
const toGrams = {
  kilos: 1000,
  gramos: 1,
  "toneladas métricas": 1000000,
  libras: 453.59237,
  onzas: 28.349523125,
};

// Nombres canónicos para mostrar en la respuesta
const unitNames = {
  kilos: "kilos",
  gramos: "gramos",
  "toneladas métricas": "toneladas métricas",
  libras: "libras",
  onzas: "onzas",
};

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
            "Se requieren los parámetros: value, from y to. Ejemplo: ?value=10&from=kilos&to=libras",
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

    // Validar que value no sea negativo (el peso no puede ser negativo)
    if (numValue < 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Valor inválido",
          message: "El peso no puede ser negativo",
        }),
      };
    }

    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();

    // Validar unidades
    if (!(fromLower in toGrams)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Unidad no válida",
          message: `La unidad '${from}' no está soportada. Unidades válidas: ${Object.keys(toGrams).join(", ")}`,
        }),
      };
    }

    if (!(toLower in toGrams)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Unidad no válida",
          message: `La unidad '${to}' no está soportada. Unidades válidas: ${Object.keys(toGrams).join(", ")}`,
        }),
      };
    }

    // Conversión: valor -> gramos -> unidad destino
    const grams = numValue * toGrams[fromLower];
    const result = grams / toGrams[toLower];

    // Construir fórmula descriptiva
    const factor = toGrams[fromLower] / toGrams[toLower];
    const formula =
      factor === 1
        ? "value * 1"
        : `value * ${parseFloat(factor.toFixed(10))}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          value: numValue,
          from: unitNames[fromLower],
          to: unitNames[toLower],
          result: parseFloat(result.toFixed(6)),
          formula: formula,
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
