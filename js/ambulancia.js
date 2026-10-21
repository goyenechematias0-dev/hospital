document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof map !== 'undefined') {
            // Creamos las ambulancias directo en el mapa con un marcador visible
            L.marker([-34.8917, -56.1555]).addTo(map).bindPopup("<b>Ambulancia 01</b>");
            L.marker([-34.8930, -56.1580]).addTo(map).bindPopup("<b>Ambulancia 02</b>");
            console.log("Ambulancias cargadas correctamente.");
        }
    }, 500);
});