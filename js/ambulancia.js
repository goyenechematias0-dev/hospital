document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof map !== 'undefined') {

            // Icono de ambulancia integrado para evitar errores de rutas
            const iconoAmbulancia = L.divIcon({
                className: 'custom-ambulance-icon',
                html: '<div style="background-color: #ff4d4d; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); text-align: center; white-space: nowrap;">🚑 Amb</div>',
                iconSize: [50, 24],
                iconAnchor: [25, 12]
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

            console.log("Ambulancias con icono visible cargadas exitosamente.");
        }
    }, 500);
});