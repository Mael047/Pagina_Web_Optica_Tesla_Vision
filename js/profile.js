
document.addEventListener("DOMContentLoaded", () => {
    if (!window.auth || !auth.isLoggedIn()) {
        const loginUrl = "inicio_sesion.html?next=profile.html";
        window.location.href = loginUrl;
        return;
    }

    const user = auth.getUser() || { name: "Usuario", email: "" };

    let root = document.querySelector("#profile-root") || document.querySelector(".profile-root");
    if (!root) {
        root = document.createElement("main");
        root.id = "profile-root";
        document.body.appendChild(root);
    }

    root.innerHTML = `
    <section style="max-width:900px;margin:40px auto;padding:22px;background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
      <h2>Mi perfil</h2>
      <div id="user-info" style="margin-bottom:18px;"></div>
      <button id="btn-logout" style="background:#0b3be6;color:#fff;padding:8px 12px;border-radius:6px;border:none;cursor:pointer">Cerrar sesión</button>
      <hr style="margin:18px 0"/>
      <h3>Historial de compras</h3>
      <div id="historial-list"></div>
    </section>
  `;

    const infoDiv = document.getElementById("user-info");
    infoDiv.innerHTML = `
    <p><strong>Nombre:</strong> ${user.name || "—"}</p>
    <p><strong>Email:</strong> ${user.email || "—"}</p>
  `;

    document.getElementById("btn-logout").addEventListener("click", () => {
        auth.logout();
        // opcional: limpiar badge
        window.location.href = "inicio_sesion.html";
    });

    const lista = document.getElementById("historial-list");
    const ordenesRaw = localStorage.getItem("ordenes");
    let ordenes = [];
    if (ordenesRaw) {
        try { ordenes = JSON.parse(ordenesRaw) || []; } catch (e) { ordenes = []; }
    } else {
        const carritoRaw = localStorage.getItem("carrito");
        if (carritoRaw) {
            try {
                const carrito = JSON.parse(carritoRaw) || [];
                if (carrito.length) {
                    ordenes = [{ id: "SIM-" + Date.now(), fecha: new Date().toLocaleString(), items: carrito }];
                }
            } catch (e) { ordenes = []; }
        }
    }

    if (!ordenes || ordenes.length === 0) {
        lista.innerHTML = `<p>No hay compras registradas.</p>`;
    } else {
        lista.innerHTML = "";
        ordenes.forEach((orden) => {
            const div = document.createElement("div");
            div.style.border = "1px solid #eee";
            div.style.padding = "12px";
            div.style.borderRadius = "6px";
            div.style.marginBottom = "10px";

            const itemsHTML = (orden.items || []).map(it => `
        <div style="display:flex;align-items:center;gap:10px;margin:6px 0;">
          <img src="${it.imagen || "img/gafas1.png"}" style="width:56px;height:auto;border-radius:6px"/>
          <div>
            <div><strong>${it.nombre || "Producto"}</strong></div>
            <div style="font-size:13px;color:#666">Ref: ${it.ref || "—"} • Cant: ${it.cantidad || 1}</div>
          </div>
          <div style="margin-left:auto;font-weight:700">$${(Number(it.precio) || 0).toLocaleString()}</div>
        </div>
      `).join("");

            div.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div><strong>Orden ${orden.id || "—"}</strong></div>
          <div style="font-size:13px;color:#666">${orden.fecha || ""}</div>
        </div>
        <div style="margin-top:8px">${itemsHTML}</div>`;
            lista.appendChild(div);
        });
    }
});
