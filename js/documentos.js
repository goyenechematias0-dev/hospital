document.addEventListener('DOMContentLoaded', () => {
    const formDocumentos = document.getElementById('form-documentos');

    if (formDocumentos) {
        formDocumentos.addEventListener('submit', (e) => {
            e.preventDefault();

            const titulo = document.getElementById('titulo')?.value;
            const categoria = document.getElementById('categoria')?.value;
            const archivo = document.getElementById('archivo')?.files[0]?.name;

            const nuevoDoc = {
                titulo,
                categoria,
                archivo,
                fecha: new Date().toLocaleDateString()
            };

            console.log('Documento listo para guardar:', nuevoDoc);
            alert(`Documento "${titulo}" subido correctamente.`);

            formDocumentos.reset();
        });
    }
});