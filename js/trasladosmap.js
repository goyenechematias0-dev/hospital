// 1. Coordenadas predeterminadas (Hospital de Clínicas, Montevideo)
const defaultLat = -34.8912019;
const defaultLng = -56.1518127;

// 2. Inicializar el mapa centrado en el Hospital de Clínicas con zoom 15
const map = L.map('map').setView([defaultLat, defaultLng], 15);

// 3. Cargar las capas visuales de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 4. Crear el marcador inicial
let marker = L.marker([defaultLat, defaultLng]).addTo(map);
marker.bindPopup("<b>Hospital de Clínicas</b><br>Montevideo, Uruguay").openPopup();

// 5. Configurar el evento del botón "Generar Pin"
const generatePinBtn = document.getElementById('generatePinBtn');
const pinStatus = document.getElementById('pinStatus');

if (generatePinBtn) {
    generatePinBtn.addEventListener('click', async () => {
        const inputDireccion = document.getElementById('direccion').value.trim();
        const selectDepto = document.getElementById('departamento').value;

        // Construir el texto de búsqueda (ej: "Av. Italia 2870, Montevideo, Uruguay")
        let queryBusqueda = "";
        if (inputDireccion && selectDepto) {
            queryBusqueda = `${inputDireccion}, ${selectDepto}, Uruguay`;
        } else if (inputDireccion) {
            queryBusqueda = `${inputDireccion}, Montevideo, Uruguay`;
        } else if (selectDepto) {
            queryBusqueda = `${selectDepto}, Uruguay`;
        } else {
            alert("Por favor ingrese una dirección o seleccione un departamento.");
            return;
        }

        if (pinStatus) {
            pinStatus.innerHTML = "🔍 Buscando ubicación...";
        }

        try {
            // Consultar el servicio de geocodificación de OpenStreetMap (Nominatim)
            const respuesta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryBusqueda)}`);
            const datos = await respuesta.json();

            if (datos && datos.length > 0) {
                const nuevaLat = parseFloat(datos[0].lat);
                const nuevaLng = parseFloat(datos[0].lon);
                const nombreLugar = datos[0].display_name;

                // Mover el mapa y el marcador a la nueva ubicación encontrada
                map.setView([nuevaLat, nuevaLng], 16);
                marker.setLatLng([nuevaLat, nuevaLng]);
                marker.bindPopup(`<b>Ubicación Encontrada:</b><br>${nombreLugar}`).openPopup();

                if (pinStatus) {
                    pinStatus.innerHTML = `✅ Pin generado con éxito para: <b>${queryBusqueda}</b>`;
                }
            } else {
                if (pinStatus) {
                    pinStatus.innerHTML = `⚠️ No se encontró una ubicación exacta para "${queryBusqueda}". Mostrando ubicación por defecto.`;
                }
            }
        } catch (error) {
            console.error("Error al buscar la dirección:", error);
            if (pinStatus) {
                pinStatus.innerHTML = `❌ Error al conectar con el servicio de mapas.`;
            }
        }
    });
}