## Introducción

En este documento se realiza una comparación entre distintos asistentes de inteligencia artificial, principalmente ChatGPT y Claude.

El objetivo es analizar cómo pueden ayudar en tareas relacionadas con el desarrollo de software, como explicar conceptos técnicos, detectar errores en código y generar funciones a partir de descripciones en lenguaje natural.

También se evaluará la claridad de las respuestas, la calidad del código generado y la utilidad de estas herramientas durante el proceso de programación.


### Prompt utilizado
"Actúa como un programador senior con talento para la enseñanza. Explícame de forma breve, con lenguaje sencillo y usando una analogía de la vida cotidiana para cada uno, los siguientes conceptos de JavaScript: Closures, Event Loop y Hoisting. Evita tecnicismos innecesarios y ve directo al grano."

### Respuesta de Chat GPT
1️⃣ Closures

Un -> closure ocurre cuando una función recuerda las variables del lugar donde fue creada, incluso si se ejecuta más tarde o en otro sitio.

Analogía de la vida cotidiana:
Imagina que haces una mochila antes de salir de casa.

Metes dentro:

tu móvil

tus llaves

dinero

Cuando estás en la calle, todo lo que necesitas sigue dentro de la mochila, aunque ya no estés en casa.

En JavaScript pasa lo mismo:
la función se lleva en su “mochila” las variables que existían cuando fue creada.

-> El Event Loop es el sistema que gestiona qué tarea se ejecuta y cuándo, especialmente cuando hay cosas que tardan (como esperar internet).s

Analogía de la vida cotidiana:
Imagina un restaurante con un camarero.

El camarero:

Toma tu pedido

Lo manda a cocina

Mientras tanto atiende otras mesas

Cuando la comida está lista, vuelve a tu mesa.

-> Hoisting significa que JavaScript mueve algunas declaraciones al inicio del archivo antes de ejecutar el código.

Analogía de la vida cotidiana:
Imagina que en clase levantas la mano antes de hablar.

El profesor ya sabe que quieres hablar, aunque todavía no hayas dicho nada.

👉 JavaScript hace algo parecido:
cuando declaras una variable o función, el motor ya la conoce antes de ejecutarse el código.

### Respuesta de Claude 

-> Closures (Cierres)
Analogía: Imagina que prestas un libro a un amigo, pero dejas una nota pegada adentro con un mensaje secreto. Aunque devuelva el libro, tu amigo siempre tendrá acceso a esa nota dentro. Las funciones también pueden “llevar” variables con ellas.
Lo esencial:
Una función “recuerda” las variables del lugar donde fue creada, incluso después de que ese lugar ya no existe. La función y sus variables quedan “cerradas” juntas.

 -> Event Loop (Bucle de eventos)
Analogía: Eres un barista en una cafetería. Tomas pedidos en orden, pero cuando alguien pide un frappé que tarda, no esperas. Atiende otros clientes (tareas rápidas) y cuando el frappé está listo, lo entregas.
Lo esencial:
JavaScript ejecuta código línea por línea, pero cuando hay operaciones lentas (como descargar algo de internet), las deja pendientes y sigue con el resto. Cuando esas operaciones terminan, vuelve a ellas.
 
 -> Hoisting (Elevación)
Analogía: En una escuela, el director anuncia al inicio del año quién son todos los profesores y estudiantes, aunque algunos todavía no hayan llegado. JavaScript hace algo parecido: “recuerda” tus variables y funciones antes de ejecutar el código.
Lo esencial:
JavaScript mueve las declaraciones de funciones y variables al “tope” mentalmente, pero no sus valores. Por eso puedes llamar una función antes de declararla.


### funciones de Javascript con errores

/**
 * SISTEMA DE FACTURACIÓN SIMPLE
 * Contiene 3 funciones principales: 
 * 1. calcularImpuesto (Flecha)
 * 2. aplicarDescuento (Expresión)
 * 3. generarTicket (Declarativa)
 */

// 1. Función de flecha para calcular el IVA (16%)
const calcularImpuesto = (subtotal) => subtotal * 0.16;

// 2. Función de expresión para aplicar un descuento fijo
const aplicarDescuento = function(precio, descuento) {
    if (descuento > precio) return 0;
    return precio - descuento;
};

// 3. Función declarativa para armar el resumen de la compra
function generarTicket(usuario, productos) {
    console.log(`--- TICKET PARA: ${usuario.toUpperCase()} ---`);
    
    // Sumamos los precios de los productos usando reduce
    let subtotal = productos.reduce((acc, p) => acc + p.precio, 0);
    
    // Usamos las otras dos funciones
    let conDescuento = aplicarDescuento(subtotal, 50); // Descuento fijo de $50
    let impuesto = calcularImpuesto(conDescuento);
    let totalFinal = conDescuento + impuesto;

    // Imprimimos el desglose
    console.log(`Subtotal: €€{subtotal}`);
    console.log(`Descuento aplicado: €50`);
    console.log(`IVA (16%): €€{impuesto.toFixed(2)}`);
    console.log(`TOTAL A PAGAR: €€{totalFinal.toFixed(2)}`);
    console.log(`-----------------------------------`);
}

// --- DATOS DE PRUEBA ---

const miCarrito = [
    { nombre: "Teclado Mecánico", precio: 120 },
    { nombre: "Mouse Gamer", precio: 80 },
    { nombre: "Alfombrilla RGB", precio: 45 }
];

// Ejecución del programa
generarTicket("Luis", miCarrito);


/**
 * SISTEMA DE FACTURACIÓN SIMPLE
 * Contiene 3 funciones principales: 
 * 1. calcularImpuesto (Flecha)
 * 2. aplicarDescuento (Expresión)
 * 3. generarTicket (Declarativa)
 */
-----------------------------------------------------------------------------------
// 1. Función de flecha para calcular el IVA (16%)
const calcularImpuesto = (subtotal) => subtotal * 0.16;

// 2. Función de expresión para aplicar un descuento fijo
const aplicarDescuento = function(precio, descuento) {
    if (descuento > precio) return 0;
    return precio - descuento;
};

// 3. Función declarativa para armar el resumen de la compra
function generarTicket(usuario, productos) {
    console.(`--- TICKET PARA: ${usuario.toUpperCase()} ---`);
    
    // Sumamos los precios de los productos usando reduce
    let subtotal  productos.reduce((acc, p) => acc + p.precio, 0);
    
     Usamos las otras dos funciones
    let conDescuento = aplicarDescuento(subtotal, 50); // Descuento fijo de $50
    let impuesto = calcularImpuesto(conDescuento);
    let totalFinal = conDescuento + impuesto;

    // Imprimimos el desglose
    console.log(`Subtotal: €€{subtotal}`);
    console.log(`Descuento aplicado: €50`);
    console.log(`IVA (16%) €€{impuesto.tOFixed(2)}`);
    console.log(`TOTAL A PAGAR: €€{totalFinal.toFixed(2)}`);
    console.log(`-----------------------------------`);
}

// --- DATOS DE PRUEBA ---

const miCarrito = [
    { nombre: "Teclado Mecánico", precio: 120 },
    {nombre: "Mouse Gamer", precio: 80 },
    { nombre: "Alfombrilla RGB", precio: 45 }
;

// Ejecución del programa
generarTicket("Luis", miCarrito); }
}


### Respuestas de chat GPT

console.(...) ❌ → faltaba log → console.log(...)

let subtotal productos.reduce ❌ → faltaba =

Comentario sin // → Usamos las otras dos funciones

tOFixed ❌ → debe ser toFixed

El array no estaba cerrado ]

Había llaves } extra al final.

### Respuestas de chat Claude 

1.	Línea 11: console.( → console.log( - Faltaba la función log
2.	Línea 14: let subtotal  productos → let subtotal = productos - Faltaba el =
3.	Línea 16: Comentario mal formado con espacios raros → Lo limpié
4.	Línea 20-23: €€{ → $${ - Símbolo de moneda duplicado y mal cerrado
5.	Línea 22: tOFixed → toFixed - Mayúscula mal colocada
6.	Línea 26: ]; faltaba cerrar correctamente el array
7.	Línea 29: Había } extra al final
El código ahora debería ejecutarse sin problemas y mostrar un ticket formateado correctamente.

### Descripción de funciones de implementación.

1. El Validador de Contraseñas Seguras
Descripción: Necesito una función que reciba una cadena de texto y me diga si es "Fuerte" o "Débil". Para ser fuerte, debe tener al menos 8 caracteres, incluir al menos un número y un carácter especial (como $ o !). Si no cumple alguna, debe retornar que es débil.
2. El Calculador de Descuento Progresivo
Descripción: Crea una función que tome el precio original de un producto y la cantidad comprada. Si el usuario compra más de 10 unidades, aplica un 15% de descuento; si compra entre 5 y 10, un 5%; y si compra menos de 5, no hay descuento. La función debe devolver el total final a pagar.
3. El Buscador de "Palíndromos"
Descripción: Diseña una función que reciba una palabra o frase y determine si se lee igual al derecho que al revés (ignorando espacios y mayúsculas). Por ejemplo, si le doy "Anita lava la tina", debería decirme que es verdadero.

### Conclusión

Para Chat gpt con el promt que utilice va directo al grano en cambio, Claude te lo define más y aprendes más porque te asesora y te dice en que linea esta el fallo. 