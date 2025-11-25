window.onload = function () {
    const formUsuario = document.getElementById("form-usuario");
    if (!formUsuario) return;

    formUsuario.onsubmit = function (event) {
        event.preventDefault();

        // Tomamos los datos del formulario
        const datos = new FormData(formUsuario);
        const dataObjeto = Object.fromEntries(datos.entries());

        console.log("Enviando usuario a la API:", dataObjeto);

        // Enviamos a tu PHP de registro de usuarios
        ajaxPostUsuario("api/post/usuario.php", dataObjeto);
    };
};

// ----- AJAX POST SOLO PARA USUARIOS -----
function ajaxPostUsuario(url, dataObjeto) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                responseServerUsuario(xhr.responseText);
            } else {
                console.error("Error en la solicitud:", xhr.status, xhr.statusText);
        const span = document.getElementById("respuesta-usuario") || document.getElementById("register-msg");
        if (span) span.textContent = "Error en la solicitud al servidor.";
            }
        }
    };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(dataObjeto));
}

// ----- RESPUESTA DEL SERVIDOR PARA USUARIO -----
function responseServerUsuario(response) {
    let jsonResponse;
    try {
        jsonResponse = JSON.parse(response);
    } catch (e) {
        console.error("Respuesta no JSON desde usuario.php:", response);
        const span = document.getElementById("respuesta-usuario");
        if (span) {
            span.textContent = "Respuesta no válida del servidor (no es JSON).";
        }
        return;
    }

    console.log("Respuesta de usuario.php:", jsonResponse);

    const span = document.getElementById("respuesta-usuario") || document.getElementById("register-msg");
    if (span) span.textContent = jsonResponse.mensaje || "";

    // Si quieres limpiar el formulario cuando todo sale bien:
    if (jsonResponse.status === "success") {
        const formUsuario = document.getElementById("form-usuario");
        if (formUsuario) formUsuario.reset();
    }
}
