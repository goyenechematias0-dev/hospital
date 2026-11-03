document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formDocumento');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            unidad: document.getElementById('unidad').value,
            tipo_documento: document.getElementById('tipo_documento').value,
            detalles: document.getElementById('detalles').value
        };

        fetch('../php/guardarDocumento.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            const mensajeDiv = document.getElementById('mensaje');
            if (data.success) {
                mensajeDiv.style.color = 'green';
                mensajeDiv.textContent = '¡Documentación guardada con éxito en el sistema!';
                form.reset();
            } else {
                mensajeDiv.style.color = 'red';
                mensajeDiv.textContent = 'Error: ' + (data.message || 'No se pudo guardar.');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
            const mensajeDiv = document.getElementById('mensaje');
            mensajeDiv.style.color = 'red';
            mensajeDiv.textContent = 'Error de conexión con el backend PHP.';
        });
    });
});