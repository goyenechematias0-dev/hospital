document.addEventListener('DOMContentLoaded', function () {
  var user = Hospital.user;
  var form = document.getElementById('form-documento');
  var alertBox = document.getElementById('alert-documento');
  var tabla = document.getElementById('tabla-documentos');

  async function cargar() {
    try {
      var res = await Hospital.get('../php/obtener_documentos.php');
      var rows = res.data || [];

      tabla.innerHTML = rows.length ? rows.map(function (d) {
        var archivo = d.ruta_archivo
          ? '<a href="../' + Hospital.esc(d.ruta_archivo) + '" target="_blank" rel="noopener">Ver archivo</a>'
          : '<span class="text-muted">—</span>';

        return '<tr>' +
          '<td>' + d.id_documento + '</td>' +
          '<td><strong>' + Hospital.esc(d.titulo) + '</strong></td>' +
          '<td>' + Hospital.esc(d.tipo_documento || '—') + '</td>' +
          '<td>' + Hospital.esc(d.usuario || '—') + '</td>' +
          '<td>' + archivo + '</td>' +
          '<td>' + Hospital.fecha(d.fecha_actualizacion) + '</td>' +
          '</tr>';
      }).join('') : '<tr><td colspan="6" class="empty">Sin documentos registrados.</td></tr>';
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
      var fd = new FormData();
      fd.append('titulo', document.getElementById('titulo').value.trim());
      fd.append('tipo_documento', document.getElementById('tipo_documento').value);
      fd.append('descripcion', document.getElementById('descripcion').value.trim());
      fd.append('id_usuario', user.id_usuario);

      var archivo = document.getElementById('archivo').files[0];
      if (archivo) fd.append('archivo', archivo);

      if (!fd.get('titulo')) {
        throw new Error('El título es obligatorio.');
      }

      var res = await fetch('../php/guardar_documentos.php', { method: 'POST', body: fd });
      var json = {};
      try {
        json = await res.json();
      } catch (err) {
        throw new Error('El servidor devolvió una respuesta inválida.');
      }

      if (!res.ok) {
        throw new Error(json.mensaje || json.message || 'Error al guardar el documento.');
      }

      Hospital.alert(alertBox, json.mensaje || 'Documento registrado con éxito.', 'success');
      form.reset();
      await cargar();
    } catch (err) {
      Hospital.alert(alertBox, err.message, 'error');
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('btn-refrescar-docs').addEventListener('click', cargar);
  cargar();
});
