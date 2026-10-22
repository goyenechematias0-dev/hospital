document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof map !== 'undefined') {

            // SVG directo de una camioneta de ambulancia (no depende de archivos ni internet)
            const svgAmbulancia = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="45" height="45">
                    <!-- Sirena -->
                    <rect x="28" y="10" width="8" height="4" fill="#ff0000" rx="1"/>
                    <!-- Cuerpo de la ambulancia -->
                    <path d="M6 20 h36 l12 12 v16 h-48 z" fill="#ffffff" stroke="#333333" stroke-width="2"/>
                    <!-- Ventana cabina -->
                    <polygon points="42,22 52,32 42,32" fill="#87ceeb" stroke="#333333" stroke-width="1"/>
                    <!-- Franja roja -->
                    <rect x="6" y="32" width="48" height="6" fill="#e60000"/>
                    <!-- Cruz médica -->
                    <rect x="20" y="24" width="8" height="14" fill="#e60000"/>
                    <rect x="17" y="27" width="14" height="8" fill="#e60000"/>
                    <!-- Ruedas -->
                    <circle cx="16" cy="48" r="6" fill="#333333"/>
                    <circle cx="16" cy="48" r="2.5" fill="#cccccc"/>
                    <circle cx="44" cy="48" r="6" fill="#333333"/>
                    <circle cx="44" cy="48" r="2.5" fill="#cccccc"/>
                </svg>
            `;

            const iconoAmbulancia = L.divIcon({
                className: 'icono-ambulancia-svg',
                html: svgAmbulancia,
                iconSize: [45, 45],
                iconAnchor: [22, 22],
                popupAnchor: [0, -20]
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
    },
    "Amb-03": {
        nombre: "Ambulancia 03",
        lat: -34.8950,
        lng: -56.1600,
        marcador: L.marker([-34.8950, -56.1600], { icon: iconoAmbulancia }).addTo(map).bindPopup("<b>Ambulancia 03</b>")
    }

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

            console.log("Ambulancias SVG cargadas correctamente.");
        }
    }, 500);
});