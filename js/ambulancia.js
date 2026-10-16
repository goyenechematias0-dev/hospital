document.addEventListener("DOMContentLoaded", () => {
    const formAmbulancia = document.querySelector("#form-ambulancia");

    if (formAmbulancia) {
        formAmbulancia.addEventListener("submit", function (e) {
            e.preventDefault();

            // Captura de datos (ajusta los IDs según tu HTML)
            const matricula = document.querySelector("#matricula")?.value.trim();
            const modelo = document.querySelector("#modelo")?.value.trim();
            const estado = document.querySelector("#estado")?.value;

            // Validación rápida
            if (!matricula || !modelo) {
                alert("Por favor, completa todos los campos obligatorios de la ambulancia.");
                return;
            }

            const formData = new FormData(formAmbulancia);

            // Enviar datos al PHP correspondiente (por ejemplo: guardarAmbulancia.php)
            fetch("../php/guardarAmbulancia.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                alert("Ambulancia registrada con éxito.");
                formAmbulancia.reset();
            })
            .catch(error => {
                console.error("Error al registrar la ambulancia:", error);
                alert("Ocurrió un error al intentar guardar la ambulancia.");
            });
        });
    }
});