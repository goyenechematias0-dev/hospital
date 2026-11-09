document.addEventListener('DOMContentLoaded', function () {
  var user = Hospital.user;
  var formT = document.getElementById('form-traslado');
  var formA = document.getElementById('form-ambulancia');
  var alertT = document.getElementById('alert-traslado');
  var alertA = document.getElementById('alert-ambulancia');
  var alertF = document.getElementById('alert-flota');
  var alertTras = document.getElementById('alert-traslados');
  var puedeCambiarTraslado = ['administrador', 'chofer', 'copiloto']
    .indexOf(String(user.rol || '').toLowerCase()) !== -1;
  var selAmb = document.getElementById('id_ambulancia');
  var tablaAmb = document.getElementById('tabla-ambulancias');
  var tablaTras = document.getElementById('tabla-traslados');

  async function cargarAmbulancias() {
    try {
      var res = await Hospital.get('../php/obtener_ambulancias.php');
      var rows = res.data || [];
      var disponibles = rows.filter(function (a) { return a.disponibilidad === 'Disponible'; });

      selAmb.innerHTML = '<option value="">Seleccione una ambulancia...</option>' +
        disponibles.map(function (a) {
          return '<option value="' + a.id_ambulancia + '">' +
            Hospital.esc(a.matricula) + ' — ' + Hospital.esc(a.modelo || '') +
            '</option>';
        }).join('');

      tablaAmb.innerHTML = rows.length ? rows.map(function (a) {
        var estados = ['Disponible', 'En traslado', 'Mantenimiento'];
        var opciones = estados.map(function (estado) {
          return '<option value="' + estado + '"' +
            (a.disponibilidad === estado ? ' selected' : '') + '>' + estado + '</option>';
        }).join('');

        return '<tr>' +
          '<td>' + a.id_ambulancia + '</td>' +
          '<td><strong>' + Hospital.esc(a.matricula) + '</strong></td>' +
          '<td>' + Hospital.esc(a.modelo || '—') + '</td>' +
          '<td><select class="form-control estado-select" data-id="' + a.id_ambulancia + '"' +
            ' data-anterior="' + Hospital.esc(a.disponibilidad) + '">' + opciones + '</select></td>' +
          '<td>' + Hospital.fecha(a.ultimo_mantenimiento) + '</td>' +
          '</tr>';
      }).join('') : '<tr><td colspan="5" class="empty">Sin ambulancias registradas.</td></tr>';
    } catch (e) {
      tablaAmb.innerHTML = '<tr><td colspan="5" class="empty">Error: ' + Hospital.esc(e.message) + '</td></tr>';
    }
  }

  function selectorEstadoTraslado(t) {
    var estados = ['Pendiente', 'En curso', 'Completado', 'Cancelado'];
    var opciones = estados.map(function (estado) {
      return '<option value="' + estado + '"' +
        (t.estado === estado ? ' selected' : '') + '>' + estado + '</option>';
    }).join('');

    return '<select class="form-control estado-select estado-traslado" data-id="' + t.id_traslado + '"' +
      ' data-anterior="' + Hospital.esc(t.estado) + '">' + opciones + '</select>';
  }

  async function cargarTraslados() {
    try {
      var res = await Hospital.get('../php/obtener_traslados.php');
      var rows = res.data || [];

      tablaTras.innerHTML = rows.length ? rows.map(function (t) {
        return '<tr>' +
          '<td>' + t.id_traslado + '</td>' +
          '<td>' + Hospital.esc(t.origen) + '</td>' +
          '<td>' + Hospital.esc(t.destino) + '</td>' +
          '<td>' + Hospital.esc(t.ambulancia || '—') + '</td>' +
          '<td>' + Hospital.esc(t.solicitante || '—') + '</td>' +
          '<td>' + (puedeCambiarTraslado ? selectorEstadoTraslado(t) : Hospital.badge(t.estado)) + '</td>' +
          '<td>' + Hospital.fecha(t.fecha_solicitud) + '</td>' +
          '</tr>';
      }).join('') : '<tr><td colspan="7" class="empty">Sin traslados registrados.</td></tr>';
    } catch (e) {
      tablaTras.innerHTML = '<tr><td colspan="7" class="empty">Error: ' + Hospital.esc(e.message) + '</td></tr>';
    }
  }

  formT.addEventListener('submit', async function (e) {
    e.preventDefault();
    Hospital.hideAlert(alertT);

    var btn = formT.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      var datos = {
        origen: document.getElementById('origen').value.trim(),
        destino: document.getElementById('destino').value.trim(),
        acompanante: document.getElementById('acompanante').value.trim(),
        id_ambulancia: selAmb.value,
        id_usuario: user.id_usuario,
        estado: selAmb.value ? 'En curso' : 'Pendiente'
      };

      if (!datos.origen || !datos.destino) {
        throw new Error('Completá el origen y el destino.');
      }

      var res = await Hospital.post('../php/guardarTraslados.php', datos);
      Hospital.alert(alertT, res.mensaje || 'Traslado registrado con éxito.', 'success');
      formT.reset();
      await Promise.all([cargarAmbulancias(), cargarTraslados()]);
    } catch (err) {
      Hospital.alert(alertT, err.message, 'error');
    } finally {
      btn.disabled = false;
    }
  });

  formA.addEventListener('submit', async function (e) {
    e.preventDefault();
    Hospital.hideAlert(alertA);

    var btn = formA.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      var datos = {
        matricula: document.getElementById('matricula').value.trim(),
        modelo: document.getElementById('modelo').value.trim(),
        disponibilidad: document.getElementById('disponibilidad').value
      };

      if (!datos.matricula) {
        throw new Error('La matrícula es obligatoria.');
      }

      var res = await Hospital.post('../php/registrar_ambulancia.php', datos);
      Hospital.alert(alertA, res.mensaje || 'Ambulancia registrada con éxito.', 'success');
      formA.reset();
      await cargarAmbulancias();
    } catch (err) {
      Hospital.alert(alertA, err.message, 'error');
    } finally {
      btn.disabled = false;
    }
  });

  tablaAmb.addEventListener('change', async function (e) {
    var sel = e.target;
    if (!sel.classList || !sel.classList.contains('estado-select')) return;

    var id = sel.getAttribute('data-id');
    var anterior = sel.getAttribute('data-anterior');
    var nuevo = sel.value;

    sel.disabled = true;
    Hospital.hideAlert(alertF);

    try {
      var res = await Hospital.post('../php/actualizar_ambulancia.php', {
        id_ambulancia: id,
        disponibilidad: nuevo
      });
      Hospital.alert(alertF, res.mensaje || 'Estado actualizado con éxito.', 'success');
      await cargarAmbulancias();
    } catch (err) {
      sel.value = anterior;
      sel.disabled = false;
      Hospital.alert(alertF, err.message, 'error');
    }
  });

  tablaTras.addEventListener('change', async function (e) {
    var sel = e.target;
    if (!sel.classList || !sel.classList.contains('estado-traslado')) return;

    var id = sel.getAttribute('data-id');
    var anterior = sel.getAttribute('data-anterior');
    var nuevo = sel.value;

    sel.disabled = true;
    Hospital.hideAlert(alertTras);

    try {
      var res = await Hospital.post('../php/actualizar_traslado.php', {
        id_traslado: id,
        estado: nuevo,
        rol: user.rol
      });
      Hospital.alert(alertTras, res.mensaje || 'Estado del traslado actualizado con éxito.', 'success');
      await Promise.all([cargarAmbulancias(), cargarTraslados()]);
    } catch (err) {
      sel.value = anterior;
      sel.disabled = false;
      Hospital.alert(alertTras, err.message, 'error');
    }
  });

  document.getElementById('btn-refrescar-amb').addEventListener('click', cargarAmbulancias);
  document.getElementById('btn-refrescar-tras').addEventListener('click', cargarTraslados);

  cargarAmbulancias();
  cargarTraslados();
});
