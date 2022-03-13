export default function ajax (options) {
    // destructuramos
    let { url, method, success, error, data  } = options;
    const xhr = new XMLHttpRequest(); // instanciamos

    xhr.addEventListener('readystatechange', (e) => { // asignamos evento
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) {
            let data = JSON.parse(xhr.responseText);
            success(data);
        } else {
            let message = xhr.statusText || 'Data Not Found';
            error(`Error ${xhr.status}: ${message}`);
        }
    })

    xhr.open(method || 'GET', url); // abrimos peticion
    xhr.setRequestHeader('Content-Type', 'application/json'); // asignamos cabecera
    xhr.send(JSON.stringify(data)); // enviamos peticion
}