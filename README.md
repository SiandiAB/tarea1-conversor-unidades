# API REST - Conversor de Unidades

API REST para conversion de unidades usando Node.js y Netlify Functions.

## URL de la API

https://tarea1-conversor-unidades-siandi.netlify.app

## Repositorio GitHub

https://github.com/SiandiAB/tarea1-conversor-unidades

## Endpoints

### GET /api/convert-distance

Unidades soportadas: metros, kilometros, centimetros, millas, yardas, pies, pulgadas

Ejemplos:
- https://tarea1-conversor-unidades-siandi.netlify.app/api/convert-distance?value=5&from=kilometros&to=millas
- https://tarea1-conversor-unidades-siandi.netlify.app/api/convert-distance?value=100&from=metros&to=pies

### GET /api/convert-temperature

Unidades soportadas: celsius, kelvin, fahrenheit

Ejemplos:
- https://tarea1-conversor-unidades-siandi.netlify.app/api/convert-temperature?value=25&from=celsius&to=fahrenheit
- https://tarea1-conversor-unidades-siandi.netlify.app/api/convert-temperature?value=300&from=kelvin&to=celsius

### GET /api/convert-weight

Unidades soportadas: kilos, gramos, toneladas metricas, libras, onzas

Ejemplos:
- https://tarea1-conversor-unidades-siandi.netlify.app/api/convert-weight?value=50&from=kilos&to=libras
- https://tarea1-conversor-unidades-siandi.netlify.app/api/convert-weight?value=1000&from=gramos&to=kilos

## Formato de respuesta (exito)

```json
{
  "success": true,
  "data": {
    "value": 5,
    "from": "kilometros",
    "to": "millas",
    "result": 3.106856,
    "formula": "value * 0.621371"
  }
}
```

## Formato de respuesta (error)

```json
{
  "success": false,
  "error": "Unidad no valida",
  "message": "La unidad 'kilometro' no esta soportada"
}
```
