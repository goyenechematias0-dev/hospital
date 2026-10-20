// Coordenadas del Hospital de Clínicas (Montevideo)
const lat = -34.8912019;
const lng = -56.1518127;

// Inicializa el mapa centrado en el Hospital de Clínicas
const map = L.map('map').setView([lat, lng], 15);

// Carga el diseño de las calles desde OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Coloca el pin/marcador en el Hospital de Clínicas
const marker = L.marker([lat, lng]).addTo(map);
marker.bindPopup("<b>Hospital de Clínicas</b><br>Montevideo, Uruguay").openPopup();