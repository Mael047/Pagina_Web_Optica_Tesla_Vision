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
    const historialList = document.getElementById("historial-list");

    function renderHistorial(pedidos) {
        if (!historialList) return;
        historialList.innerHTML = "";

        let lista = [];
        if (Array.isArray(pedidos)) {
            lista = pedidos;
        } else if (typeof pedidos === "string" && pedidos.trim() !== "") {
            try {
                const parsed = JSON.parse(pedidos);
                if (Array.isArray(parsed)) lista = parsed;
            } catch (err) {
                console.error("Pedidos no es JSON", err);
            }
        }

        if (!lista.length) {
            historialList.innerHTML = '<p class="vacio">No tienes compras registradas aun.</p>';
            return;
        }

        lista.slice().reverse().forEach((orden) => {
            const card = document.createElement("div");
            card.className = "historial-card";

            const total = Number(orden.total) || 0;
            const totalFmt = new Intl.NumberFormat("es-ES").format(total);
            const itemsCantidad = Array.isArray(orden.items)
                ? orden.items.reduce((acc, it) => acc + (Number(it.cantidad) || 1), 0)
                : 0;

            const itemsDetalle = Array.isArray(orden.items)
                ? orden.items
                      .map((it) => {
                          const nombre = it.nombre || "Producto";
                          const ref = it.ref ? ` (Ref: ${it.ref})` : "";
                          const cant = Number(it.cantidad) || 1;
                          const precio = Number(it.precio) || 0;
                          const subtotal = cant * precio;
                          const subtotalFmt = new Intl.NumberFormat("es-ES").format(subtotal);
                          return `<li>${nombre}${ref} x${cant} — $${subtotalFmt}</li>`;
                      })
                      .join("")
                : "";

            card.innerHTML = `
                <div class="historial-header">
                    <strong>#${orden.order_id || ""}</strong>
                    <span>${orden.estado || "pagado"}</span>
                </div>
                <div class="historial-body">
                    <div><small>Fecha</small><br>${orden.fecha || ""}</div>
                    <div><small>Total</small><br>$${totalFmt}</div>
                    <div><small>Envio</small><br>${orden.envio || ""}</div>
                    <div><small>Items</small><br>${itemsCantidad}</div>
                </div>
                ${
                    itemsDetalle
                        ? `<div class="historial-items-wrap">
                            <small>Detalle</small>
                            <ul class="historial-items">${itemsDetalle}</ul>
                           </div>`
                        : ""
                }
            `;
            historialList.appendChild(card);
        });
    }

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
            document.getElementById("id").value = usuario.id || "";
            
            // Rellenar el formulario
            document.getElementById("nombre").value = usuario.nombre || "";
            document.getElementById("correo").value = usuario.correo || "";

            // Nuevos campos (no se muestra rol)
            if (document.getElementById("direccion")) {
                document.getElementById("direccion").value = usuario.direccion || "";
            }
            if (document.getElementById("telefono")) {
                document.getElementById("telefono").value = usuario.telefono || "";
            }

            renderHistorial(usuario.pedidos || []);
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
            direccion: document.getElementById("direccion") ? document.getElementById("direccion").value : "",
            telefono: document.getElementById("telefono") ? document.getElementById("telefono").value : "",
            password: document.getElementById("password").value, // puede estar vacío
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
