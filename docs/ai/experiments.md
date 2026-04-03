## Introducción

En este documento se recogen diferentes experimentos realizados con herramientas de inteligencia artificial aplicadas al desarrollo de software.

Se describirán pruebas realizadas para analizar cómo estas herramientas pueden ayudar a entender código, detectar errores y generar soluciones de programación.
 
 ## primer problema 

function verificarPassword(password) {
    if (password.length >= 8) {
        return "Contraseña válida";
    } else {
        return "Contraseña muy corta";
    }
}

console.log(verificarPassword("abc"));           // Contraseña muy corta
console.log(verificarPassword("mipassword123")); // Contraseña válida

## Explicación
Tenia que darme cuenta que JavaScript tiene una propiedad llamada .length que te dice cuántos caracteres tiene una cadena de texto.

 ## segundo problema 

 function calcularMedia(numeros) {
    let suma = 0;
    for (let i = 0; i < numeros.length; i++) {
        suma = suma + numeros[i];
    }
    return suma / numeros.length;
}

console.log(calcularMedia([4, 8, 6, 10])); // 7


## Explicación
Para calcular una media necesitas dos cosas: sumar todos los números y dividir entre cuántos hay, se tenía que tener en cuenta "For" para poderlo calcular.

 ## tercer problema 


function filtrarMayores(edades) {
    let resultado = [];
    for (let i = 0; i < edades.length; i++) {
        if (edades[i] >= 18) {
            resultado.push(edades[i]);
        }
    }
    return resultado;
}

console.log(filtrarMayores([12, 22, 17, 30, 15])); // [22, 30]

## Explicación
Tenia que tener 2 cosas en cuenta recorrer un array y que se cumpliera una condición.


## conclusión 

Tuve que invertir más o menos 1h para poder solucionar estos problemas en cambio la IA solo segundos, se ha convertido en una herramienta muy poderosa donde el tiempo que se invertía antes que eran horas, ahora son segundos. 

## Mejoras en mi código

Me ha mejorado en a lógica de filtrado y ordenación (estado, prioridad y A‑Z), optimicé la persistencia en LocalStorage y refiné la UI para móvil y modo oscuro, incluyendo fondo animado y estadísticas simplificadas.