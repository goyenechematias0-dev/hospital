document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof map !== 'undefined') {

            // Icono SVG de Ambulancia
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
            window.intervaloSimulacion = null;

            // Coordenadas base (Hospital de Clínicas)
            const latHospital = -34.8917;
            const lngHospital = -56.1555;

            // Inicialización de la unidad principal Amb-01
            let marcadorPrincipal = L.marker([latHospital, lngHospital], { 
                icon: iconoAmbulancia, 
                draggable: true 
            }).addTo(map).bindPopup("<b>Ambulancia Amb-01</b><br>Estado: Disponible");

            window.ambulancias['Amb-01'] = {
                nombre: 'Ambulancia 01',
                lat: latHospital,
                lng: lngHospital,
                estado: 'Disponible',
                marcador: marcadorPrincipal
            };

            // 1. OBTENER GEOLOCALIZACIÓN REAL DEL NAVEGADOR / GPS (Con alta precisión y zoom cercano)
            window.obtenerUbicacionGPS = function() {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        let latGPS = position.coords.latitude;
                        let lngGPS = position.coords.longitude;

                        // Actualiza la posición de la ambulancia y acerca el zoom a nivel de calle (16)
                        window.ambulancias['Amb-01'].marcador.setLatLng([latGPS, lngGPS]);
                        map.setView([latGPS, lngGPS], 16);
                        
                        window.ambulancias['Amb-01'].marcador.getPopup().setContent("<b>Ambulancia Amb-01</b><br>¡Ubicación GPS Real detectada!");
                        window.ambulancias['Amb-01'].marcador.openPopup();
                        console.log(`GPS Real obtenido: Lat ${latGPS}, Lng ${lngGPS}`);
                    }, (error) => {
                        alert("Error de GPS: Asegúrate de permitir el acceso a tu ubicación en el navegador. Detalle: " + error.message);
                    }, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    });
                } else {
                    alert("Tu navegador no soporta geolocalización.");
                }
            };

            // 2. SIMULAR MOVIMIENTO EN VIVO A LO LARGO DE LA RUTA
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

                            if (window.intervaloSimulacion) {
                                clearInterval(window.intervaloSimulacion);
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

                            // Extraer ruta para mover la ambulancia dinámicamente
                            window.controlRuta.on('routesfound', function(e) {
                                let routes = e.routes;
                                let summary = routes[0].summary;
                                let tiempoEstimadoMin = Math.round(summary.totalTime / 60);
                                let coordenadasCoordenadas = routes[0].coordinates;

                                // Cambiar Estado a 'En Traslado'
                                window.ambulancias['Amb-01'].estado = 'En Traslado';
                                window.ambulancias['Amb-01'].marcador.getPopup().setContent(`<b>Ambulancia Amb-01</b><br>Estado: En Traslado<br>Tiempo Est.: ${tiempoEstimadoMin} min`);
                                window.ambulancias['Amb-01'].marcador.openPopup();

                                let paso = 0;
                                let totalPasos = coordenadasCoordenadas.length;

                                window.intervaloSimulacion = setInterval(() => {
                                    if (paso < totalPasos) {
                                        let puntoActual = coordenadasCoordenadas[paso];
                                        window.ambulancias['Amb-01'].marcador.setLatLng([puntoActual.lat, puntoActual.lng]);
                                        paso += Math.ceil(totalPasos / 40); // Progresión en directo
                                    } else {
                                        clearInterval(window.intervaloSimulacion);
                                        window.ambulancias['Amb-01'].estado = 'Completado';
                                        window.ambulancias['Amb-01'].marcador.getPopup().setContent("<b>Ambulancia Amb-01</b><br>Estado: Traslado Finalizado");
                                        alert("¡La ambulancia ha llegado a destino!");
                                    }
                                }, 1000);
                            });

                        } else {
                            alert(`No se encontró la dirección en ${selectDepto}.`);
                        }
                    })
                    .catch(error => {
                        console.error("Error al buscar la dirección:", error);
                    });
            };

            // 3. CREAR Y ELIMINAR UNIDADES DINÁMICAMENTE
            window.agregarAmbulancia = function() {
                let contador = Object.keys(window.ambulancias).length + 1;
                let idAmbulancia = `Amb-${contador < 10 ? '0' + contador : contador}`;
                let nombre = `Ambulancia ${contador}`;

                let lat = latHospital + (Math.random() - 0.5) * 0.015;
                let lng = lngHospital + (Math.random() - 0.5) * 0.015;

                let marcador = L.marker([lat, lng], { 
                    icon: iconoAmbulancia, 
                    draggable: true 
                }).addTo(map).bindPopup(`<b>${nombre}</b><br>Estado: Disponible`);

                window.ambulancias[idAmbulancia] = {
                    nombre: nombre,
                    lat: lat,
                    lng: lng,
                    estado: 'Disponible',
                    marcador: marcador
                };
            };

            window.eliminarAmbulancia = function(idAmbulancia) {
                if (!idAmbulancia) {
                    let keys = Object.keys(window.ambulancias);
                    if (keys.length > 1) { // No elimina la unidad principal
                        idAmbulancia = keys[keys.length - 1];
                    }
                }

                if (window.ambulancias && window.ambulancias[idAmbulancia] && idAmbulancia !== 'Amb-01') {
                    map.removeLayer(window.ambulancias[idAmbulancia].marcador);
                    delete window.ambulancias[idAmbulancia];
                }
            };

            console.log("Sistema MBM Médica listo.");
        }
    }, 500);
});