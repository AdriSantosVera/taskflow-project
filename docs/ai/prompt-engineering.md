## Introducción

En este documento se explica el uso de técnicas de prompt engineering al trabajar con asistentes de inteligencia artificial.

Se documentarán diferentes tipos de prompts utilizados para obtener explicaciones técnicas, generación de código y análisis de errores, con el objetivo de mejorar la calidad de las respuestas obtenidas.

## Prompt nº1.

## Técnica: Role prompting. 

Actúa como un desarrollador senior en JavaScript con más de 10 años de experiencia.
Revisa esta función y dime qué problemas ves en términos de rendimiento, legibilidad y buenas prácticas.
Sé directo y concreto.

## Por qué funciona:
 Al asignarle un rol experto, la IA ajusta el nivel de profundidad y el tono de la respuesta. Evita explicaciones básicas y se centra en lo que realmente importa.

## Prompt nº2. 

## Técnica: Few-shot prompting

Cuando te pase una función sin documentar, añade comentarios JSDoc completos.

Ejemplo:
Entrada:
function suma(a, b) {
  return a + b;
}

Salida:
/**
 * Suma dos números.
 * @param {number} a - Primer número.
 * @param {number} b - Segundo número.
 * @returns {number} La suma de a y b.
 */
function suma(a, b) {
  return a + b;
}

## Por qué funciona: 
El ejemplo le muestra exactamente el formato esperado. Sin el ejemplo, la IA podría usar un estilo de documentación diferente al que necesitas. 

## Prompt nº3.

## Técnica: Chain of thought (razonamiento paso a paso).

Antes de refactorizar este código, explica paso a paso:
1. Qué problemas encuentras
2. Qué cambios harías y por qué
3. Cómo quedaría el código final

## Por qué funciona: 
Al pedirle que razone antes de actuar, la IA detecta más problemas y toma mejores decisiones. Las refactorizaciones son más justificadas y fáciles de revisar.

## Prompt nº4.

## Técnica: Restricciones claras

Escribe una función en JavaScript que filtre un array de objetos por una propiedad dada.
Restricciones:
- Usa arrow functions
- No uses librerías externas
- Añade un ejemplo de uso al final en comentario
- Responde solo con el código, sin explicaciones adicionales

## Por qué funciona: 
Las restricciones eliminan la ambigüedad. La IA sabe exactamente qué incluir y qué omitir, lo que ahorra tiempo de edición posterior.

## Prompt nº5.

## Técnica: Role prompting + restricciones

Actúa como si estuvieras haciendo una code review en un equipo profesional.
Revisa este código y lista solo los bugs o errores potenciales, sin sugerencias de estilo.
Formato: una línea por bug, indicando la línea aproximada y el problema.

## Por qué funciona: 
Combinar el rol con restricciones de formato da respuestas muy accionables. El desarrollador sabe exactamente dónde mirar y qué corregir.

## Prompt nº6.

## Técnica:  Role prompting + few-shot

Actúa como un technical writer que documenta código para otros desarrolladores.
Genera la documentación de este módulo en formato Markdown con estas secciones:
- Descripción general
- Funciones exportadas (nombre, parámetros, retorno)
- Ejemplo de uso

Ejemplo de función documentada:
### escapeHtml(str)
Escapa caracteres especiales HTML en una cadena.
- `str` (string): Cadena a escapar.
- Retorna: string con caracteres escapados.

Ahora documenta este módulo:

## Por qué funciona: 
El ejemplo guía el formato exacto de cada función documentada, y el rol de technical writer orienta el tono hacia el lector, no hacia el autor del código.

## Prompt nº7.

## Técnica: Razonamiento paso a paso + restricciones

Tengo un archivo app.js de ~900 líneas. Quiero dividirlo en módulos.
Antes de proponer nada, analiza el código paso a paso:
1. Identifica las responsabilidades distintas que hay
2. Propón qué archivos crear y qué iría en cada uno
3. Indica qué imports/exports habría que añadir

No escribas el código todavía, solo el plan.

## Por qué funciona: 
Separar el análisis de la ejecución evita que la IA haga cambios precipitados. Primero validas el plan y luego ejecutas, lo que reduce errores.


## Prompt nº8.

## Técnica: Few-shot + restricciones

Escribe tests unitarios con Jest para la siguiente función.
Cubre al menos estos casos:
- Caso normal
- Valor vacío o nulo
- Caso límite

Ejemplo de formato esperado:
test('descripción del caso', () => {
  expect(miFuncion(input)).toBe(output);
});

Función a testear:

## Por qué funciona: 
Al especificar los casos a cubrir y el formato esperado, los tests generados son más completos y consistentes con el estilo del proyecto.

## Prompt nº9.

## Técnica: Role prompting + razonamiento paso a paso


Actúa como un desarrollador que tiene que explicar código legacy a un compañero nuevo en el equipo.
Explica este código paso a paso, en lenguaje sencillo:
1. Qué hace en general
2. Qué hace cada parte importante
3. Qué cosas podrían ser confusas o mejorar

## Por qué funciona: 
El rol de "explicar a un compañero nuevo" fuerza un lenguaje claro y sin tecnicismos innecesarios. Ideal para entender código que llevas tiempo sin tocar.

## Prompt nº10.

## Técnica: Role prompting + chain of thought + restricciones

Actúa como un desarrollador especializado en rendimiento web.
Analiza esta función y propón mejoras de rendimiento.
Requisitos:
- Explica el problema de rendimiento antes de proponer la solución
- Indica la mejora esperada (aunque sea aproximada)
- No cambies la firma de la función
- Si añades debounce o caché, explica brevemente cómo funciona

## Por qué funciona: 
Pedir justificación antes de la solución obliga a la IA a priorizar los cambios más impactantes. Las restricciones evitan cambios que rompan la interfaz existent