// js/profile.js

// Helper para leer cookies
function getCookie(nombre) {
    const valor = `; ${document.cookie}`;
    const partes = valor.split(`; ${nombre}=`);
    if (partes.length === 2) {
        return decodeURIComponent(partes.pop().split(";").shift());
    }
    return null;
}

window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-usuario");
    const respuestaSpan = document.getElementById("respuesta");

    // 1. Leer correo desde la cookie
    const correoCookie = getCookie("user_correo");
    if (!correoCookie) {
        alert("No hay usuario en sesión. Inicia sesión de nuevo.");
        window.location.href = "index.html"; // ajusta la ruta
        return;
    }

    // 2. Pedir al backend los datos del usuario por correo
    fetch("api/get/get_usuario.php?correo=" + encodeURIComponent(correoCookie))
        .then((r) => r.json())
        .then((usuario) => {
            if (!usuario) {
                alert("No se encontraron datos del usuario.");
                return;
            }

            // Rellenar el formulario
            document.getElementById("id").value = usuario.id;
            document.getElementById("nombre").value = usuario.nombre || "";
            document.getElementById("correo").value = usuario.correo || "";
            document.getElementById("rol").value = usuario.rol || "";
        })
        .catch((err) => {
            console.error(err);
            alert("Error al cargar los datos del usuario.");
        });

    // 3. Enviar cambios al backend
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = {
            id: document.getElementById("id").value,
            nombre: document.getElementById("nombre").value,
            correo: document.getElementById("correo").value,
            rol: document.getElementById("rol").value,
            password: document.getElementById("password").value, // opcional
        };

        fetch("api/post/actualizar_usuario.php", {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=UTF-8" },
            body: JSON.stringify(data),
        })
            .then((r) => r.json())
            .then((res) => {
                respuestaSpan.textContent = res.mensaje || "Datos actualizados";

                // limpiar campo password
                document.getElementById("password").value = "";

                // si se cambió el correo, actualiza la cookie
                document.cookie =
                    "user_correo=" +
                    encodeURIComponent(data.correo) +
                    "; path=/; max-age=86400";
            })
            .catch((err) => {
                console.error(err);
                respuestaSpan.textContent = "Error al actualizar el usuario";
            });
    });
});
