window.onload = function () {
    const formulario = document.getElementById("formulario");
    const imagenInput = document.getElementById("imagen");
    
    ajaxGet("api/get/productos.php");

    formulario.onsubmit = function (event) {
        event.preventDefault(); // Evita el envío del formulario

        const datos = new FormData(formulario); // Recopila los datos del formulario
        const dataObjeto = Object.fromEntries(datos.entries());

        if (imagenInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                dataObjeto.imagen = e.target.result; // Agregar al objeto de datos
                ajax("api/post/registro.php", dataObjeto);
            };
            reader.readAsDataURL(imagenInput.files[0]);
        } else
        {
            ajaxPost("api/post/registro.php", dataObjeto);
        }
    }
}

function ajaxPost(url, dataObjeto) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                responseServer(xhr.responseText);
            } else {
                console.error("Error en la solicitud:", xhr.statusText);
            }
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(dataObjeto));
}

function ajaxGet(url) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                responseServerGet(xhr.responseText);
            } else {
                console.error("Error en la solicitud:", xhr.statusText);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send();
}

preview = document.getElementById("preview");
imagenInput = document.getElementById("imagen");

imagenInput.onchange = function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

function responseServer(response) {
    let jsonResponse = JSON.parse(response);
    console.log("Respuesta del servidor:", jsonResponse);
    const respuestaSpan = document.getElementById("respuesta");
    respuestaSpan.textContent = jsonResponse.mensaje;
}

function responseServerGet(response) {
    let productos = JSON.parse(response);
    console.log("Productos recibidos:", productos);
    const productosList = document.getElementById("productos");
    productosList.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos
    productos.forEach(function(producto) {
        const li = document.createElement("li");
        li.textContent = producto.nombre + " - " + producto.referencia + " - " + producto.categoria;
        productosList.appendChild(li);
    });
}