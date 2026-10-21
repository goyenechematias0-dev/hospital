document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistroUsuario');
    const resultado = document.getElementById('resultado');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Obtener los valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const rol = document.getElementById('rol').value;

            if (!nombre || !email || !password || !rol) {
                resultado.innerHTML = '<span style="color: red;">Por favor complete todos los campos.</span>';
                return;
            }

            resultado.innerHTML = 'Enviando datos...';

            // Estructura de datos para enviar en JSON
            const datosUsuario = {
                nombre: nombre,
                email: email,
                password: password,
                rol: rol
            };

            try {
                // Envío por fetch al archivo PHP
                const respuesta = await fetch('../php/registroUsuario.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosUsuario)
                });

                const data = await respuesta.json();

                if (data.exito) {
                    resultado.innerHTML = `<span style="color: green;">✅ ${data.mensaje}</span>`;
                    form.reset();
                } else {
                    resultado.innerHTML = `<span style="color: red;">❌ ${data.mensaje}</span>`;
                }
            } catch (error) {
                console.error('Error:', error);
                resultado.innerHTML = '<span style="color: red;">Error al conectar con el servidor.</span>';
            }
        });
    }
});