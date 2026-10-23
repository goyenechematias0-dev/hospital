document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof map !== 'undefined') {

            // Icono SVG de Ambulancia interactiva
            const svgAmbulancia = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="45" height="45">
                    <rect x="28" y="10" width="8" height="4" fill="#ff0000" rx="1"/>
                    <path d="M6 20 h36 l12 12 v16 h-48 z" fill="#ffffff" stroke="#333333" stroke-width="2"/>
                    <polygon points="42,22 52,32 42,32" fill="#87ceeb" stroke="#333333" stroke-width="1"/>
                    <rect x="6" y="32" width="48" height="6" fill="#e60000"/>
                    <rect x="20" y="24" width="8" height="14" fill="#e60000"/>
                    <rect x="17" y="27" width="14" height="8" fill="#e60000"/>
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

            window.ambulancias = {};

            // Carga inicial de 10 ambulancias en zonas cercanas al Hospital de Clínicas
            const totalAmbulancias = 10; 
            let latBase = -34.8917;
            let lngBase = -56.1555;

            for (let i = 1; i <= totalAmbulancias; i++) {
                let id = `Amb-${i < 10 ? '0' + i : i}`;
                let offsetX = (Math.random() - 0.5) * 0.015;
                let offsetY = (Math.random() - 0.5) * 0.015;
                let lat = latBase + offsetX;
                let lng = lngBase + offsetY;

                let marcador = L.marker([lat, lng], { 
                    icon: iconoAmbulancia, 
                    draggable: true 
                }).addTo(map).bindPopup(`<b>Ambulancia ${i < 10 ? '0' + i : i}</b>`);

                marcador.on('dragend', function (event) {
                    let posicion = event.target.getLatLng();
                    if (window.ambulancias[id]) {
                        window.ambulancias[id].lat = posicion.lat;
                        window.ambulancias[id].lng = posicion.lng;
                    }
                });

                window.ambulancias[id] = {
                    nombre: `Ambulancia ${i}`,
                    lat: lat,
                    lng: lng,
                    marcador: marcador
                };
            }

            // Función para mover ambulancia manualmente
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

            // Crear una nueva ambulancia dinámica
            window.agregarAmbulancia = function() {
                let contador = 11;
                while (window.ambulancias[`Amb-${contador}`] || window.ambulancias[`Amb-0${contador}`]) {
                    contador++;
                }
                let idAmbulancia = `Amb-${contador < 10 ? '0' + contador : contador}`;
                let nombre = `Ambulancia ${contador}`;

                let lat = latBase + (Math.random() - 0.5) * 0.015;
                let lng = lngBase + (Math.random() - 0.5) * 0.015;

                let marcador = L.marker([lat, lng], { 
                    icon: iconoAmbulancia, 
                    draggable: true 
                }).addTo(map).bindPopup(`<b>${nombre}</b>`);

                marcador.on('dragend', function (event) {
                    let posicion = event.target.getLatLng();
                    if (window.ambulancias[idAmbulancia]) {
                        window.ambulancias[idAmbulancia].lat = posicion.lat;
                        window.ambulancias[idAmbulancia].lng = posicion.lng;
                    }
                });

                window.ambulancias[idAmbulancia] = {
                    nombre: nombre,
                    lat: lat,
                    lng: lng,
                    marcador: marcador
                };

                console.log(`${nombre} agregada.`);
            };

            // Eliminar última unidad o una unidad específica
            window.eliminarAmbulancia = function(idAmbulancia) {
                if (!idAmbulancia) {
                    let keys = Object.keys(window.ambulancias);
                    if (keys.length > 0) {
                        idAmbulancia = keys[keys.length - 1];
                    }
                }

                if (window.ambulancias && window.ambulancias[idAmbulancia]) {
                    map.removeLayer(window.ambulancias[idAmbulancia].marcador);
                    delete window.ambulancias[idAmbulancia];
                    console.log(`Ambulancia ${idAmbulancia} eliminada.`);
                }
            };

            // Trazado de rutas hacia cualquier departamento de Uruguay
            window.controlRuta = null;

            window.calcularRutaDesdeInput = function() {
                let inputDir = document.getElementById('direccion').value;
                let selectDepto = document.getElementById('departamento').value;

                if (inputDir.trim() === "") {
                    alert("Por favor, ingresa una dirección de destino.");
                    return;
                }

                if (selectDepto === "") {
                    alert("Por favor, selecciona un departamento.");
                    return;
                }

                const latHospital = -34.8917;
                const lngHospital = -56.1555;

                let queryBusqueda = `${inputDir}, ${selectDepto}, Uruguay`;

                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryBusqueda)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.length > 0) {
                            let latDestino = parseFloat(data[0].lat);
                            let lngDestino = parseFloat(data[0].lon);

                            if (window.controlRuta) {
                                map.removeControl(window.controlRuta);
                            }

                            window.controlRuta = L.Routing.control({
                                waypoints: [
                                    L.latLng(latHospital, lngHospital),
                                    L.latLng(latDestino, lngDestino)
                                ],
                                routeWhileDragging: false,
                                language: 'es',
                                createMarker: function(i, wp) {
                                    return L.marker(wp.latLng);
                                }
                            }).addTo(map);

                            map.setView([latDestino, lngDestino], 13);
                            console.log("Ruta generada hacia: " + queryBusqueda);
                        } else {
                            alert(`No se encontró la dirección "${inputDir}" en ${selectDepto}. Intenta ser más específico.`);
                        }
                    })
                    .catch(error => {
                        console.error("Error al buscar la dirección:", error);
                    });
            };

            console.log("Sistema de rutas MBM Médica cargado correctamente.");
        }
    }, 500);
});