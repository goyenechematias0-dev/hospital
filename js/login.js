document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cedula = document.getElementById('Cedula')?.value;
      const password = document.getElementById('password')?.value;
      console.log('Datos listos para enviar:', { cedula, password });
    });
  }
});