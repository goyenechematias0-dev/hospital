document.addEventListener("DOMContentLoaded", () => {
    
    // 1. GESTIÓN DEL MAPA Y MÚLTIPLES AMBULANCIAS (Se ejecuta si el mapa existe en la página)
    if (typeof map !== 'undefined') {
        var iconoAmbulancia = L.icon({
            iconUrl: '../img/ambulancia.png',
            iconSize: [35, 35],
            iconAnchor: [17, 17]
        });

        // Registro de unidades activas
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

        // Función para cargar las unidades en el mapa
        window.cargarAmbulanciasEnMapa = function() {
            for (let id in ambulancias) {
                let amb = ambulancias[id];
                amb.marcador = L.marker([amb.lat, amb.lng], { icon: iconoAmbulancia })
                                .addTo(map)
                                .bindPopup(`<b>Unidad:</b> ${amb.nombre}`);
            }
        };

        // Función para mover una ambulancia específica
        window.moverAmbulancia = function(idAmbulancia, nuevaLat, nuevaLng) {
            if (ambulancias[idAmbulancia]) {
                ambulancias[idAmbulancia].lat = nuevaLat;
                ambulancias[idAmbulancia].lng = nuevaLng;
                ambulancias[idAmbulancia].marcador.setLatLng([nuevaLat, nuevaLng]);
            } else {
                console.warn("La ambulancia no existe: " + idAmbulancia);
            }
        };

        // Inicializar el mapa con las ambulancias
        cargarAmbulanciasEnMapa();
    }

    // 2. GESTIÓN DEL FORMULARIO DE REGISTRO (Envío a PHP)
    const formAmbulancia = document.querySelector("#form-ambulancia");

    if (formAmbulancia) {
        formAmbulancia.addEventListener("submit", function (e) {
            e.preventDefault();

            const matricula = document.querySelector("#matricula")?.value.trim();
            const modelo = document.querySelector("#modelo")?.value.trim();
            const estado = document.querySelector("#estado")?.value;

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