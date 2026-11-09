document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('form-registro');
  var alertBox = document.getElementById('alert-registro');

  function mostrar(msg, tipo) {
    if (!alertBox) return;
    alertBox.className = 'alert show alert-' + (tipo || 'error');
    alertBox.textContent = msg;
  }

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    var password = document.getElementById('password').value;
    var password2 = document.getElementById('password2').value;

    if (password !== password2) {
      mostrar('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      mostrar('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    var datos = {
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      cedula: document.getElementById('cedula').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      email: document.getElementById('email').value.trim(),
      rol: document.getElementById('rol').value,
      password: password
    };

    if (!datos.nombre || !datos.apellido || !datos.cedula || !datos.email || !datos.rol) {
      mostrar('Completá todos los campos obligatorios.');
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Registrando...';

    try {
      var res = await fetch('../php/registrousuario.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      var data = {};
      try {
        data = await res.json();
      } catch (err) {
        throw new Error('El servidor devolvió una respuesta inválida.');
      }

      if (!res.ok || !data.exito) {
        throw new Error(data.mensaje || 'No se pudo registrar el usuario.');
      }

      mostrar('¡Usuario registrado con éxito! Redirigiendo al login...', 'success');
      form.reset();

      setTimeout(function () {
        window.location.href = '../index.html';
      }, 1400);
    } catch (err) {
      mostrar(err.message || 'Error de conexión con el servidor.');
      btn.disabled = false;
      btn.textContent = 'Registrarme';
    }
  });
});
