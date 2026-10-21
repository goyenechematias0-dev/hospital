document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof map !== 'undefined') {

            // Creamos el icono usando la imagen oficial de tu carpeta img
            const iconoAmbulancia = L.icon({
                iconUrl: '../img/ambulancia.png', // Ruta hacia tu carpeta img en XAMPP
                iconSize: [45, 30],               // Ancho y alto de la imagen
                iconAnchor: [22, 15],             // Punto central del icono
                popupAnchor: [0, -15]             // Dónde se abre el cartelito
            });

            // Unidades de ambulancias en el mapa
            window.ambulancias = {
                "Amb-01": {
                    nombre: "Ambulancia 01",
                    lat: -34.8917,
                    lng: -56.1555,
                    marcador: L.marker([-34.8917, -56.1555], { icon: iconoAmbulancia }).addTo(map).bindPopup("<b>Ambulancia 01</b>")
                },
                "Amb-02": {
                    nombre: "Ambulancia 02",
                    lat: -34.8930,
                    lng: -56.1580,
                    marcador: L.marker([-34.8930, -56.1580], { icon: iconoAmbulancia }).addTo(map).bindPopup("<b>Ambulancia 02</b>")
                }
            };

            // Función para mover la ambulancia con el botón verde
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

            console.log("Ambulancias con imagen cargadas.");
        }
    }, 500);
});