document.addEventListener('DOMContentLoaded', function () {
  var user = Hospital.user;
  var form = document.getElementById('form-encuesta');
  var alertBox = document.getElementById('alert-encuesta');
  var tabla = document.getElementById('tabla-encuestas');

  async function cargar() {
    try {
      var res = await Hospital.get('../php/obtener_encuestas.php');
      var rows = res.data || [];

      tabla.innerHTML = rows.length ? rows.map(function (e) {
        return '<tr>' +
          '<td>' + e.id_encuesta + '</td>' +
          '<td><strong>' + Hospital.esc(e.titulo) + '</strong></td>' +
          '<td>' + Hospital.badge(e.calificacion) + '</td>' +
          '<td>' + Hospital.esc(e.comentarios || '—') + '</td>' +
          '<td>' + Hospital.esc(e.usuario || '—') + '</td>' +
          '<td>' + Hospital.fecha(e.fecha_creacion) + '</td>' +
          '</tr>';
      }).join('') : '<tr><td colspan="6" class="empty">Sin encuestas registradas.</td></tr>';
    } catch (e) {
      tabla.innerHTML = '<tr><td colspan="6" class="empty">Error: ' + Hospital.esc(e.message) + '</td></tr>';
    }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    Hospital.hideAlert(alertBox);

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      var datos = {
        titulo: document.getElementById('titulo-encuesta').value.trim(),
        calificacion: document.getElementById('calificacion').value,
        comentarios: document.getElementById('comentarios').value.trim(),
        id_usuario: user.id_usuario
      };

      if (!datos.titulo || !datos.calificacion) {
        throw new Error('Completá el título y la calificación.');
      }

      var res = await Hospital.post('../php/guardar_encuesta.php', datos);
      Hospital.alert(alertBox, res.mensaje || 'Encuesta guardada con éxito.', 'success');
      form.reset();
      await cargar();
    } catch (err) {
      Hospital.alert(alertBox, err.message, 'error');
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('btn-refrescar-encuestas').addEventListener('click', cargar);
  cargar();
});
