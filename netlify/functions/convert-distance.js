// netlify/functions/convert-distance.js
// Endpoint: GET /api/convert-distance?value=5&from=kilometros&to=millas

// Factores de conversión: todas las unidades se convierten primero a metros (unidad base)
const toMeters = {
  metros: 1,
  kilometros: 1000,
  centimetros: 0.01,
  millas: 1609.344,
  yardas: 0.9144,
  pies: 0.3048,
  pulgadas: 0.0254,
};

// Nombres canónicos para mostrar en la fórmula
const unitNames = {
  metros: "metros",
  kilometros: "kilómetros",
  centimetros: "centímetros",
  millas: "millas",
  yardas: "yardas",
  pies: "pies",
  pulgadas: "pulgadas",
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
            "Se requieren los parámetros: value, from y to. Ejemplo: ?value=5&from=kilometros&to=millas",
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

    // Validar que value no sea negativo (la distancia no puede ser negativa)
    if (numValue < 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Valor inválido",
          message: "La distancia no puede ser negativa",
        }),
      };
    }

    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();

    // Validar unidades
    if (!toMeters[fromLower]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Unidad no válida",
          message: `La unidad '${from}' no está soportada. Unidades válidas: ${Object.keys(toMeters).join(", ")}`,
        }),
      };
    }

    if (!toMeters[toLower]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Unidad no válida",
          message: `La unidad '${to}' no está soportada. Unidades válidas: ${Object.keys(toMeters).join(", ")}`,
        }),
      };
    }

    // Conversión: valor -> metros -> unidad destino
    const meters = numValue * toMeters[fromLower];
    const result = meters / toMeters[toLower];

    // Construir fórmula descriptiva
    const factor = toMeters[fromLower] / toMeters[toLower];
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
