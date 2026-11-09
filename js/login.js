document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('form-login');
  var alertBox = document.getElementById('alert-login');

  function mostrar(msg, tipo) {
    if (!alertBox) return;
    alertBox.className = 'alert show alert-' + (tipo || 'error');
    alertBox.textContent = msg;
  }

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    var identificador = document.getElementById('identificador').value.trim();
    var password = document.getElementById('password').value;

    if (!identificador || !password) {
      mostrar('Completá todos los campos.');
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Ingresando...';

    try {
      var res = await fetch('php/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identificador, cedula: identificador, password: password })
      });

      var data = {};
      try {
        data = await res.json();
      } catch (err) {
        throw new Error('El servidor devolvió una respuesta inválida.');
      }

      if (!res.ok || !data.exito) {
        throw new Error(data.mensaje || 'No se pudo iniciar sesión.');
      }

      localStorage.setItem('hospital_user', JSON.stringify(data.usuario));
      mostrar('¡Bienvenido/a, ' + data.usuario.nombre + '!', 'success');

      setTimeout(function () {
        window.location.href = 'pages/menu.html';
      }, 450);
    } catch (err) {
      mostrar(err.message || 'Error de conexión con el servidor.');
      btn.disabled = false;
      btn.textContent = 'Ingresar';
    }
  });
});
