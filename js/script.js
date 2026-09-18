const formAmbulancia = document.getElementById('form-ambulancia');
const btnGuardar = document.getElementById('btn-guardar');

if (formAmbulancia) {
    formAmbulancia.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('amb-id').value;
        const matricula = document.getElementById('amb-matricula').value;
        const modelo = document.getElementById('amb-modelo').value;
        const estado = document.getElementById('amb-estado').value;

        // Crear contenedor FormData (como en los apuntes)
        let doc = new FormData();
        doc.append('matricula', matricula);
        doc.append('modelo', modelo);
        doc.append('estado', estado);

        if (id) {
            doc.append('accion', 'actualizar');
            doc.append('id_ambulancia', id);
        } else {
            doc.append('accion', 'crear');
        }

        // Petición asíncrona mediante Fetch
        let respuesta = await fetch('crud_ambulancia.php', {
            method: 'POST',
            body: doc
        });

        let resultado = await respuesta.text();

        if (resultado.trim() === 'ok') {
            alert('Operación realizada con éxito');
            formAmbulancia.reset();
            location.reload(); // Recarga para ver reflejado los cambios
        } else {
            alert('Error al procesar la solicitud');
        }
    });
}

// Función para eliminar
async function eliminarAmbulancia(id) {
    if (confirm('¿Desea eliminar esta ambulancia?')) {
        let doc = new FormData();
        doc.append('accion', 'eliminar');
        doc.append('id_ambulancia', id);

        let respuesta = await fetch('crud_ambulancia.php', {
            method: 'POST',
            body: doc
        });

        let resultado = await respuesta.text();
        if (resultado.trim() === 'ok') {
            alert('Ambulancia eliminada');
            location.reload();
        } else {
            alert('Error al eliminar');
        }
    }
}