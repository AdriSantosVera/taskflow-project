# Backend API: herramientas y por qué se usan

## Axios
Axios es una librería HTTP basada en promesas para JavaScript (navegador y Node.js). Su objetivo es simplificar las peticiones a APIs y reducir la verbosidad de `fetch`.

Ventajas clave:
- **Interceptores**: ejecutar lógica antes de enviar o al recibir (tokens, logging, errores globales).
- **JSON automático**: no necesitas `response.json()`.
- **Timeouts configurables**: evita peticiones colgadas.
- **Cancelación**: soporte con `AbortController` o el mecanismo propio de Axios.
- **Errores consistentes**: lanza error en respuestas 4xx/5xx.

En proyectos reales se centraliza en un archivo (`api.js`, `http.js`) con base URL, headers e interceptores.

## Postman
Postman es una herramienta para probar, documentar y explorar APIs sin escribir código.

Usos principales:
- Probar endpoints manualmente (GET, POST, PATCH, DELETE).
- **Colecciones**: agrupar requests por flujos.
- **Entornos**: variables como `{{base_url}}` o `{{token}}`.
- **Tests**: validaciones automáticas con scripts.
- **Docs**: documentación generada desde colecciones.

Es ideal para verificar una API antes de integrarla al frontend.

## Sentry
Sentry es una plataforma de monitoreo de errores en producción.

Qué aporta:
- Captura automática de excepciones con SDK.
- **Contexto completo**: stack trace, navegador, usuario, URL, breadcrumbs.
- **Agrupación inteligente**: evita alertas duplicadas.
- **Alertas**: email, Slack, etc.
- **Rendimiento**: métricas de tiempos y latencias.

Es clave en producción porque muchos errores no se reportan manualmente.

## Swagger (OpenAPI)
Swagger es el conjunto de herramientas que implementa el estándar **OpenAPI** para documentar APIs REST.

En la práctica permite:
- Definir endpoints, parámetros, body y respuestas en YAML/JSON.
- Generar documentación interactiva (Swagger UI).
- Crear un contrato formal entre frontend y backend.
- Generar clientes HTTP automáticamente.
- Validar peticiones contra el schema en algunos frameworks.
