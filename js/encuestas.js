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
                // Enviar datos al archivo PHP
                const response = await fetch("../../php/guardar_encuesta.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datosEncuesta)
                });

                const resultado = await response.json();

                if (resultado.success) {
                    alert("¡Encuesta guardada con éxito en la base de datos!");
                    formEncuestas.reset();
                } else {
                    alert("Error al guardar: " + resultado.message);
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                alert("¡Formulario validado! (Recuerda que para guardar en la base de datos debes ejecutar un servidor PHP local como XAMPP).");
                formEncuestas.reset();
            }
        });
    }
});