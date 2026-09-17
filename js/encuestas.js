document.addEventListener("DOMContentLoaded", () => {
    const formEncuestas = document.getElementById("form-encuestas");

    if (formEncuestas) {
        formEncuestas.addEventListener("submit", async (e) => {
            e.preventDefault();

            const calificacion = document.getElementById("calificacion").value;
            const comentarios = document.getElementById("comentarios").value.trim();

            if (!comentarios) {
                alert("Por favor, ingresa un comentario u observación.");
                return;
            }

            const datosEncuesta = { calificacion, comentarios };

            try {
                // Intenta enviar a PHP (Servidor Local)
                const response = await fetch("../../php/guardar_encuesta.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosEncuesta)
                });

                if (!response.ok) throw new Error("Servidor PHP no disponible");

                const resultado = await response.json();
                if (resultado.success) {
                    alert("¡Encuesta guardada con éxito en MySQL!");
                    formEncuestas.reset();
                }
            } catch (error) {
                // Respaldo para GitHub Pages o entorno sin servidor PHP
                console.log("Datos de la encuesta capturados:", datosEncuesta);
                alert("¡Encuesta enviada con éxito! (Modo demostración en GitHub Pages)");
                formEncuestas.reset();
            }
        });
    }
});