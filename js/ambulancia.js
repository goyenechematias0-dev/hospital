document.addEventListener("DOMContentLoaded", () => {
    
    // Esperamos un segundo a que el mapa de trasladosmap.js termine de crearse por completo
    setTimeout(() => {
        if (typeof map !== 'undefined') {
            // Icono personalizado para las ambulancias
            var iconoAmbulancia = L.icon({
                iconUrl: '../img/ambulancia.png', // Asegúrate de que tu imagen se llame así en la carpeta img
                iconSize: [35, 35],
                iconAnchor: [17, 17]
            });

            // Registro de unidades activas cerca del Hospital de Clínicas
            var ambulancias = {
                "Amb-01": {
                    nombre: "Ambulancia 01",
                    lat: -34.8917,
                    lng: -56.1555,
                    marcador: null
                },
                "Amb-02": {
                    nombre: "Ambulancia 02",
                    lat: -34.8930,
                    lng: -56.1580,
                    marcador: null
                }
            };

            // Cargar las unidades en el mapa
            window.cargarAmbulanciasEnMapa = function() {
                for (let id in ambulancias) {
                    let amb = ambulancias[id];
                    amb.marcador = L.marker([amb.lat, amb.lng], { icon: iconoAmbulancia })
                                    .addTo(map)
                                    .bindPopup(`<b>Unidad:</b> ${amb.nombre}`);
                }
            };

            // Función para mover cualquier ambulancia
            window.moverAmbulancia = function(idAmbulancia, nuevaLat, nuevaLng) {
                if (ambulancias[idAmbulancia]) {
                    ambulancias[idAmbulancia].lat = nuevaLat;
                    ambulancias[idAmbulancia].lng = nuevaLng;
                    ambulancias[idAmbulancia].marcador.setLatLng([nuevaLat, nuevaLng]);
                } else {
                    console.warn("La ambulancia no existe: " + idAmbulancia);
                }
            };

            // Ejecutar la carga
            cargarAmbulanciasEnMapa();
            console.log("Ambulancias cargadas en el mapa correctamente.");
        } else {
            console.warn("El mapa 'map' aún no está disponible.");
        }
    }, 500); // Pequeña espera de medio segundo

    // Gestión del formulario de registro de ambulancias (por si estás en otra vista)
    const formAmbulancia = document.querySelector("#form-ambulancia");
    if (formAmbulancia) {
        formAmbulancia.addEventListener("submit", function (e) {
            e.preventDefault();
            const matricula = document.querySelector("#matricula")?.value.trim();
            const modelo = document.querySelector("#modelo")?.value.trim();

            if (!matricula || !modelo) {
                alert("Por favor, completa todos los campos obligatorios de la ambulancia.");
                return;
            }

            const formData = new FormData(formAmbulancia);
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