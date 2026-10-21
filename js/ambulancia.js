document.addEventListener("DOMContentLoaded", () => {
    
    // Esperamos medio segundo a que el mapa de trasladosmap.js se cree por completo
    setTimeout(() => {
        if (typeof map !== 'undefined') {

            // Crear el icono usando tu imagen de la carpeta img
            const iconoAmbulancia = L.icon({
                iconUrl: '../img/ambulancia.png', 
                iconSize: [45, 30],               
                iconAnchor: [22, 15],             
                popupAnchor: [0, -15]             
            });

            // Registro de unidades iniciales cerca del Hospital de Clínicas
            window.ambulancias = {
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

            // Dibujar las ambulancias en el mapa
            window.cargarAmbulanciasEnMapa = function() {
                for (let id in window.ambulancias) {
                    let amb = window.ambulancias[id];
                    amb.marcador = L.marker([amb.lat, amb.lng], { icon: iconoAmbulancia })
                                    .addTo(map)
                                    .bindPopup(`<b>Unidad:</b> ${amb.nombre}`);
                }
            };

            // Función para mover la ambulancia
            window.moverAmbulancia = function(idAmbulancia, nuevaLat, nuevaLng) {
                if (window.ambulancias && window.ambulancias[idAmbulancia]) {
                    let amb = window.ambulancias[idAmbulancia];
                    amb.lat = nuevaLat;
                    amb.lng = nuevaLng;
                    if (amb.marcador) {
                        amb.marcador.setLatLng([nuevaLat, nuevaLng]);
                        map.panTo([nuevaLat, nuevaLng]); 
                    }
                }
            };

            // Cargar los marcadores al iniciar
            cargarAmbulanciasEnMapa();
            console.log("Carga de ambulancias completada correctamente.");
        } else {
            console.error("El objeto 'map' no está definido todavía.");
        }
    }, 500);
});