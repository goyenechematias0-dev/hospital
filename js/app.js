/* ============================================================
   S.I.G.S.M. - Utilidades compartidas y control de sesión
   ============================================================ */
(function () {
  var raw = localStorage.getItem('hospital_user');
  var user = null;

  try {
    user = raw ? JSON.parse(raw) : null;
  } catch (e) {
    user = null;
  }

  // Si no hay sesión, volver al login (las páginas viven en /pages).
  if (!user && !window.HOSPITAL_NO_AUTH) {
    window.location.replace('../index.html');
    return;
  }

  window.Hospital = {
    user: user,

    logout: function () {
      localStorage.removeItem('hospital_user');
      window.location.href = 'login.html';
    },

    alert: function (el, msg, type) {
      if (!el) return;
      el.className = 'alert show alert-' + (type || 'info');
      el.textContent = msg;
    },

    hideAlert: function (el) {
      if (el) el.className = 'alert';
    },

    post: async function (url, data) {
      var res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      var json = {};
      try {
        json = await res.json();
      } catch (e) {
        throw new Error('El servidor devolvió una respuesta inválida.');
      }
      if (!res.ok) {
        throw new Error(json.mensaje || json.message || 'Error en la operación.');
      }
      return json;
    },

    get: async function (url) {
      var res = await fetch(url, { headers: { Accept: 'application/json' } });
      var json = {};
      try {
        json = await res.json();
      } catch (e) {
        throw new Error('El servidor devolvió una respuesta inválida.');
      }
      if (!res.ok) {
        throw new Error(json.message || json.mensaje || 'Error al cargar los datos.');
      }
      return json;
    },

    badge: function (estado) {
      var mapa = {
        'Disponible': 'success',
        'Completado': 'success',
        'En traslado': 'warning',
        'En curso': 'warning',
        'Ocupado': 'warning',
        'Mantenimiento': 'danger',
        'Cancelado': 'danger',
        'Inactivo': 'danger',
        'Pendiente': 'info'
      };
      var cls = mapa[estado] || 'info';
      return '<span class="badge badge-' + cls + '">' + Hospital.esc(estado) + '</span>';
    },

    esc: function (s) {
      return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },

    fecha: function (s) {
      if (!s) return '—';
      var d = new Date(String(s).replace(' ', 'T'));
      if (isNaN(d.getTime())) return s;
      return d.toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-user-name]').forEach(function (el) {
      var nombre = ((user.nombre || '') + ' ' + (user.apellido || '')).trim();
      el.textContent = nombre || 'Usuario';
    });

    document.querySelectorAll('[data-user-role]').forEach(function (el) {
      el.textContent = user.rol || '';
    });

    document.querySelectorAll('[data-user-initial]').forEach(function (el) {
      el.textContent = (user.nombre || 'U').charAt(0).toUpperCase();
    });

    document.querySelectorAll('[data-logout]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        window.Hospital.logout();
      });
    });
  });
})();
