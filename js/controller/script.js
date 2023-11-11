// Select all elements with the "i" tag and store them in a NodeList called "stars"
const stars = document.querySelectorAll(".stars i");


const mensajeElement = document.getElementById("mensaje");
// Define los mensajes para cada cantidad de estrellas seleccionadas
const mensajes = [
    "¡Terrible!",
    "¡Malo!",
    "¡Regular!",
    "¡Bueno!",
    "¡Excelente!",
    "¡Terrible!"
];


// Loop through the "stars" NodeList
stars.forEach((star, index1) => {
    // Add an event listener that runs a function when the "click" event is triggered
    star.addEventListener("click", () => {
        // Loop through the "stars" NodeList Again
        stars.forEach((star, index2) => {
            // Add the "active" class to the clicked star and any stars with a lower index
            // and remove the "active" class from any stars with a higher index
            index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
        });
        // Contar estrellas activas para obtener el puntaje
        const puntaje = document.querySelectorAll(".stars i.active").length;

        // Mostrar el puntaje en console.log()
        console.log(`Puntaje: ${puntaje}`);

        mensajeElement.textContent = mensajes[puntaje - 1];
    });
});