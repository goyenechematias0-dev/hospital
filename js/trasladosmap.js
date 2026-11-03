// =========================================================
// S.I.G.S.M. - MONITOREO DE TRASLADOS Y MAPA INTERACTIVO
// =========================================================

const defaultLat = -34.8912019;
const defaultLng = -56.1518127;

// Inicializar el mapa centrado en el Hospital de Clínicas
const map = L.map('map').setView([defaultLat, defaultLng], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Lista para almacenar los marcadores creados en el mapa
let listaMarcadores = [];

// =========================================================
// ICONO VECTORIAL DE AMBULANCIA (SEGURO Y VISIBLE)
// =========================================================
const iconoAmbulanciaPersonalizado = L.divIcon({
    className: 'custom-ambulance-marker',
    html: `
        <div style="
            background-color: #0056b3; 
            color: white; 
            width: 42px; 
            height: 42px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 20px; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
            border: 2px solid white;
        ">🚑</div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -21]
});

// Función para asociar un popup simple con información de la unidad
function configurarPopupAmbulancia(marcador, textoLugar, idUnidad) {
    const contenidoPopup = `
        <div style="font-family: Arial; padding: 5px; min-width: 160px; text-align: center;">
            <h4 style="margin: 0 0 5px 0; color: #0056b3;">Unidad: ${idUnidad}</h4>
            <p style="margin: 4px 0; font-size: 13px;"><b>Ubicación:</b><br>${textoLugar}</p>
        </div>
    `;
    marcador.bindPopup(contenidoPopup);
}

// Crear el marcador inicial del Hospital de Clínicas
let markerPrincipal = L.marker([defaultLat, defaultLng], { icon: iconoAmbulanciaPersonalizado }).addTo(map);
configurarPopupAmbulancia(markerPrincipal, "Hospital de Clínicas, Montevideo", "AMB-001");
listaMarcadores.push({ id: "AMB-001", marker: markerPrincipal });

// =========================================================
// FUNCIONALIDAD DEL BOTÓN "+ Crear Unidad"
// =========================================================
const btnCrearUnidad = document.getElementById('crearUnidadBtn');
if (btnCrearUnidad) {
    btnCrearUnidad.addEventListener('click', () => {
        let idAmbulancia = prompt("Ingrese el identificador de la nueva unidad (Ej: AMB-002):");
        if (idAmbulancia && idAmbulancia.trim() !== "") {
            let latRand = defaultLat + (Math.random() - 0.5) * 0.02;
            let lngRand = defaultLng + (Math.random() - 0.5) * 0.02;

            let nuevoMarcador = L.marker([latRand, lngRand], { icon: iconoAmbulanciaPersonalizado }).addTo(map);
            configurarPopupAmbulancia(nuevoMarcador, "Unidad en Operación Activa", idAmbulancia.trim());
            nuevoMarcador.openPopup();

            listaMarcadores.push({ id: idAmbulancia.trim(), marker: nuevoMarcador });
            alert("¡Unidad " + idAmbulancia.trim() + " creada con éxito!");
        }
    });
}

// =========================================================
// FUNCIONALIDAD DEL BOTÓN "- Eliminar Unidad"
// =========================================================
const btnEliminarUnidad = document.getElementById('eliminarUnidadBtn');
if (btnEliminarUnidad) {
    btnEliminarUnidad.addEventListener('click', () => {
        if (listaMarcadores.length <= 1) {
            alert("Debe mantener al menos una unidad activa en el mapa.");
            return;
        }
        let idAEliminar = prompt("Ingrese el identificador de la unidad a eliminar (Ej: AMB-002):");
        if (idAEliminar) {
            let index = listaMarcadores.findIndex(item => item.id.toUpperCase() === idAEliminar.trim().toUpperCase());
            if (index !== -1) {
                map.removeLayer(listaMarcadores[index].marker);
                listaMarcadores.splice(index, 1);
                alert("Unidad " + idAEliminar + " eliminada del mapa.");
            } else {
                alert("No se encontró ninguna unidad con ese identificador.");
            }
        }
    });
}

// =========================================================
// VINCULACIÓN Y FUNCIONALIDAD DE LOS CONTROLES SUPERIORES Y PHP
// =========================================================
const generatePinBtn = document.getElementById('generatePinBtn');
const pinStatus = document.getElementById('pinStatus');

if (generatePinBtn) {
    generatePinBtn.addEventListener('click', async () => {
        const inputDireccion = document.getElementById('direccion').value.trim();
        const selectDepto = document.getElementById('departamento').value;

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
            const respuesta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryBusqueda)}`);
            const datos = await respuesta.json();

            if (datos && datos.length > 0) {
                const nuevaLat = parseFloat(datos[0].lat);
                const nuevaLng = parseFloat(datos[0].lon);
                const nombreLugar = datos[0].display_name;

                map.setView([nuevaLat, nuevaLng], 16);
                markerPrincipal.setLatLng([nuevaLat, nuevaLng]);
                
                const idTrasladoNuevo = "TRASLADO-" + Math.floor(1000 + Math.random() * 9000);
                configurarPopupAmbulancia(markerPrincipal, nombreLugar, idTrasladoNuevo);
                markerPrincipal.openPopup();

                if (pinStatus) {
                    pinStatus.innerHTML = `✅ Pin generado con éxito para: <b>${queryBusqueda}</b>`;
                }

                // Envío automático al backend PHP
                let formData = new FormData();
                formData.append('origen', 'Hospital de Clínicas, Montevideo');
                formData.append('destino', queryBusqueda);
                formData.append('acompanante', 'Personal médico');

                fetch('../php/guardarTraslados.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Respuesta de la BD:", data.mensaje);
                })
                .catch(error => {
                    console.error("Error al registrar en PHP:", error);
                });

            } else {
                if (pinStatus) {
                    pinStatus.innerHTML = `⚠️ No se encontró una ubicación exacta para "${queryBusqueda}".`;
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
