document.addEventListener('DOMContentLoaded', function () {
  if (typeof L === 'undefined') {
    return;
  }

  var clinicasLat = -34.8936;
  var clinicasLng = -56.1475;

  var map = L.map('map').setView([clinicasLat, clinicasLng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  setTimeout(function () { map.invalidateSize(); }, 300);

  var iconoAmbulancia = L.divIcon({
    className: 'custom-ambulance-icon',
    html: '<div style="font-size:24px;background:#fff;border-radius:50%;width:35px;height:35px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 5px rgba(0,0,0,.3);border:2px solid #1a365d;">🚑</div>',
    iconSize: [35, 35],
    iconAnchor: [17, 17]
  });

  L.marker([clinicasLat, clinicasLng], { icon: iconoAmbulancia }).addTo(map)
    .bindPopup('<b>Hospital de Clínicas</b><br>Base Central S.I.G.S.M.')
    .openPopup();

  var arrayAmbulancias = [];
  var controlRuta = null;
  var coordenadasRutaActual = [];
  var marcadorEnMovimiento = null;

  var btnCrear = document.getElementById('crearUnidadBtn');
  if (btnCrear) {
    btnCrear.addEventListener('click', function (e) {
      e.preventDefault();
      var lat = clinicasLat + (Math.random() - 0.5) * 0.02;
      var lng = clinicasLng + (Math.random() - 0.5) * 0.02;
      var idUnidad = arrayAmbulancias.length + 1;
      var marker = L.marker([lat, lng], { icon: iconoAmbulancia }).addTo(map)
        .bindPopup('<b>Ambulancia activa #' + idUnidad + '</b><br>Salida: Hospital de Clínicas');
      arrayAmbulancias.push(marker);
    });
  }

  var btnEliminar = document.getElementById('eliminarUnidadBtn');
  if (btnEliminar) {
    btnEliminar.addEventListener('click', function (e) {
      e.preventDefault();
      if (arrayAmbulancias.length > 0) {
        map.removeLayer(arrayAmbulancias.pop());
      }
    });
  }

  var btnRuta = document.getElementById('generatePinBtn');
  var btnAnimar = document.getElementById('animarAmbulanciaBtn');
  var inputDireccion = document.getElementById('direccion');
  var selectDepartamento = document.getElementById('departamento');
  var statusDiv = document.getElementById('pinStatus');

  if (selectDepartamento && inputDireccion) {
    var actualizarPlaceholder = function () {
      inputDireccion.placeholder = 'Ej: 18 de Julio 1200, ' + selectDepartamento.value;
    };
    selectDepartamento.addEventListener('change', actualizarPlaceholder);
    actualizarPlaceholder();
  }

  if (btnRuta) {
    btnRuta.addEventListener('click', function (e) {
      e.preventDefault();
      var direccionTexto = inputDireccion.value.trim();

      if (!direccionTexto) {
        alert('Por favor, ingresá una dirección de destino válida.');
        return;
      }

      var departamento = selectDepartamento ? selectDepartamento.value : 'Montevideo';

      statusDiv.innerHTML = 'Buscando dirección en ' + departamento + ' y calculando ruta...';
      btnAnimar.style.display = 'none';

      var queryURL = 'https://nominatim.openstreetmap.org/search?format=json&q=' +
        encodeURIComponent(direccionTexto + ', ' + departamento + ', Uruguay');

      fetch(queryURL)
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (!data || data.length === 0) {
            statusDiv.innerHTML = '❌ No se encontró la dirección. Intentá con otra.';
            return;
          }

          var destLat = parseFloat(data[0].lat);
          var destLng = parseFloat(data[0].lon);

          if (controlRuta) map.removeControl(controlRuta);
          if (marcadorEnMovimiento) map.removeLayer(marcadorEnMovimiento);

          controlRuta = L.Routing.control({
            waypoints: [
              L.latLng(clinicasLat, clinicasLng),
              L.latLng(destLat, destLng)
            ],
            routeWhileDragging: false,
            language: 'es',
            showAlternatives: false,
            fitSelectedRoutes: true,
            createMarker: function (i, wp) {
              if (i === 0) {
                return L.marker(wp.latLng, { icon: iconoAmbulancia }).bindPopup('Salida: Hospital de Clínicas');
              }
              return L.marker(wp.latLng).bindPopup('Destino: ' + direccionTexto + ' (' + departamento + ')');
            }
          }).addTo(map);

          controlRuta.on('routesfound', function (ev) {
            var summary = ev.routes[0].summary;
            var distanciaKm = (summary.totalDistance / 1000).toFixed(2);
            var tiempoMin = Math.round(summary.totalTime / 60);
            coordenadasRutaActual = ev.routes[0].coordinates;

            statusDiv.innerHTML = '✅ Ruta lista | Distancia: <b>' + distanciaKm +
              ' km</b> | Tiempo: <b>' + tiempoMin + ' min</b>. ¡Ya podés iniciar el recorrido!';
            btnAnimar.style.display = 'block';
          });
        })
        .catch(function (err) {
          console.error(err);
          statusDiv.innerHTML = '⚠️ Error al conectar con el servicio de mapas.';
        });
    });
  }

  if (btnAnimar) {
    btnAnimar.addEventListener('click', function (e) {
      e.preventDefault();
      if (coordenadasRutaActual.length === 0) return;

      btnAnimar.disabled = true;
      statusDiv.innerHTML = '🚑 Ambulancia en camino hacia el destino...';

      if (marcadorEnMovimiento) map.removeLayer(marcadorEnMovimiento);

      marcadorEnMovimiento = L.marker([clinicasLat, clinicasLng], { icon: iconoAmbulancia })
        .addTo(map)
        .bindPopup('<b>Unidad en emergencia</b><br>En movimiento hacia el destino')
        .openPopup();

      var index = 0;

      function moverPaso() {
        if (index < coordenadasRutaActual.length) {
          var punto = coordenadasRutaActual[index];
          marcadorEnMovimiento.setLatLng([punto.lat, punto.lng]);
          index++;
          setTimeout(moverPaso, 40);
        } else {
          statusDiv.innerHTML = '🏁 ¡La ambulancia llegó al destino con éxito!';
          btnAnimar.disabled = false;
          marcadorEnMovimiento.bindPopup('<b>Unidad llegada al destino</b><br>Servicio completado').openPopup();
        }
      }

      moverPaso();
    });
  }
});
