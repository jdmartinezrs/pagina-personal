document.addEventListener('DOMContentLoaded', () => {
    const resultados = document.getElementById('resultados');
    
    if (!resultados) {
        console.error('Elemento con ID "resultados" no encontrado.');
        return;
    }

    fetch('data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let delay = 0; 
            data.forEach((element, index) => {
                setTimeout(() => {
                    const div = document.createElement('div');
                    div.classList.add('slide');
                    div.innerHTML = `<p>${element.nombre_comun}</p>
                                     <p>${element.nombre_cientifico}</p>`;
                    
                    resultados.appendChild(div);
                }, delay);
                
                delay += 2500; 
            });
        })
        .catch(error => console.error('Error al obtener los datos:', error));
});
