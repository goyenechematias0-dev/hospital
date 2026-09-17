document.addEventListener("DOMContentLoaded", () => {
    const formEncuestas = document.getElementById("form-encuestas");

    if (formEncuestas) {
        formEncuestas.addEventListener("submit", (e) => {
            e.preventDefault();

            const calificacion = document.getElementById("calificacion").value;
            const comentarios = document.getElementById("comentarios").value.trim();

            if (!comentarios) {
                alert("Por favor, ingresa un comentario u observación.");
                return;
            }

            // Objeto listo para enviar al backend (PHP)
            const datosEncuesta = {
                calificacion,
                comentarios,
                fecha: new Date().toISOString()
            };

            console.log("Datos capturados:", datosEncuesta);
            alert("¡Encuesta enviada con éxito!");

            // Limpiar el formulario
            formEncuestas.reset();
        });
    }
});