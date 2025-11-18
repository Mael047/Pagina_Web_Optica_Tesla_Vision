document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll('.resumen-opciones input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                checkboxes.forEach((other) => {
                    if (other !== this) other.checked = false;
                });
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const btnEnviar = document.querySelector(".btn-enviar");
    const textarea = document.getElementById("asesoria");

    if (btnEnviar && textarea) {
        btnEnviar.addEventListener("click", function () {
            const mensaje = textarea.value.trim();

            if (mensaje !== "") {
                textarea.value = "";

                const aviso = document.createElement("p");
                aviso.textContent = "Tu mensaje fue enviado correctamente.";
                aviso.style.color = "#4a66a3";
                aviso.style.marginTop = "8px";
                aviso.style.fontWeight = "600";

                btnEnviar.parentNode.appendChild(aviso);

                setTimeout(() => aviso.remove(), 2000);
            }
        });
    }
});


/* -------------------- agregar al carrito + badge (desde producto.html) -------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".btn-comprar");
    if (!btn) return;

    function showToast(text) {
        let container = document.getElementById("cart-toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "cart-toast-container";
            container.style.position = "fixed";
            container.style.right = "20px";
            container.style.bottom = "20px";
            container.style.zIndex = "9999";
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.gap = "10px";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = "cart-toast";
        toast.innerHTML = `
        <div style="font-weight:700;margin-bottom:4px;">${text}</div>
        <a href="carrito.html" style="text-decoration:none;font-size:13px;">Ver carrito</a>`;
        toast.style.background = "#ffffff";
        toast.style.border = "1px solid rgba(0,0,0,0.08)";
        toast.style.padding = "12px 14px";
        toast.style.borderRadius = "8px";
        toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
        toast.style.minWidth = "180px";
        toast.style.color = "#111";
        toast.style.opacity = "0";
        toast.style.transition = "opacity 200ms ease, transform 200ms ease";
        toast.style.transform = "translateY(6px)";

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(6px)";
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    }

    function updateCartBadge() {
        const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];
        const total = carritoLocal.reduce((acc, p) => acc + (Number(p.cantidad) || 1), 0);

        // Buscar icono del carrito
        const icon = document.querySelector(".nav-right .icon") || document.querySelector(".icon");
        if (!icon) return;

        const cs = window.getComputedStyle(icon);
        if (cs.position === "static") icon.style.position = "relative";

        let badge = icon.querySelector(".cart-badge");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "cart-badge";
            badge.style.position = "absolute";
            badge.style.top = "-6px";
            badge.style.right = "-6px";
            badge.style.background = "#e53935";
            badge.style.color = "#fff";
            badge.style.borderRadius = "999px";
            badge.style.padding = "2px 6px";
            badge.style.fontSize = "12px";
            badge.style.fontWeight = "700";
            badge.style.lineHeight = "1";
            badge.style.minWidth = "20px";
            badge.style.textAlign = "center";
            icon.appendChild(badge);
        }

        if (total > 0) {
            badge.textContent = total;
            badge.style.display = "inline-block";
        } else {
            badge.style.display = "none";
        }
    }

    btn.addEventListener("click", () => {
        // Extraer datos de la página del producto
        const nombreEl = document.querySelector(".detalles-producto h1") || document.querySelector("h1");
        const refEl = document.querySelector(".detalles-producto h3") || document.querySelector("h3");
        const materialEl = document.querySelector(".detalles-producto h2") || document.querySelector("h2");
        const precioEl = document.querySelector(".detalles-producto .precio") || document.querySelector(".precio");
        const imagenEl = document.querySelector(".carrusel img") || document.querySelector(".producto img") || document.querySelector("img");

        const nombre = nombreEl ? nombreEl.textContent.trim() : "Producto";
        let ref = refEl ? refEl.textContent.trim() : "";
        if (ref && ref.includes(":")) ref = ref.split(":").slice(1).join(":").trim();

        // Extraer material (limpiando 'Material: ...')
        let material = "";
        if (materialEl) {
            material = materialEl.textContent.trim();
            if (material.includes(":")) material = material.split(":").slice(1).join(":").trim();
        }

        // Precio: preferir data-descuento, luego data-precio, luego texto
        let precio = 0;
        if (precioEl) {
            const dataDescuento = precioEl.dataset ? precioEl.dataset.descuento : null;
            const dataPrecio = precioEl.dataset ? precioEl.dataset.precio : null;

            let raw = precioEl.textContent; // valor por defecto: lo que se ve en pantalla

            const numDescuento = dataDescuento !== undefined && dataDescuento !== null
                ? Number(dataDescuento)
                : NaN;
            const numPrecio = dataPrecio !== undefined && dataPrecio !== null
                ? Number(dataPrecio)
                : NaN;

            if (!Number.isNaN(numDescuento) && numDescuento > 0) {
                // hay descuento válido
                raw = dataDescuento;
            } else if (!Number.isNaN(numPrecio) && numPrecio > 0) {
                // no hay descuento, pero sí precio normal
                raw = dataPrecio;
            }

            const cleaned = String(raw).replace(/[^\d]/g, "");
            precio = cleaned ? parseInt(cleaned, 10) : 0;
        }

        const imagen = imagenEl ? (imagenEl.src || imagenEl.getAttribute("src")) : "";

        // Crear objeto producto (AHORA incluyendo material)
        const producto = { nombre, ref, material, precio, imagen, cantidad: 1 };

        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const idx = carrito.findIndex(p => p.ref && producto.ref && p.ref === producto.ref);

        if (idx > -1) {
            carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1;
        } else {
            carrito.push(producto);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));

        showToast(`${nombre} agregado al carrito.`);

        // actualizar badge
        updateCartBadge();
    });

    updateCartBadge();
});


/* -------------------- renderizado del carrito en carrito.html -------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.querySelector(".tabla-productos");
    const totalElement = document.querySelector(".resumen-total");
    if (!contenedorProductos || !totalElement) return;

    const mensajeVacio = document.createElement("p");
    mensajeVacio.textContent = "Tu carrito está vacío.";
    mensajeVacio.style.textAlign = "center";
    mensajeVacio.style.fontWeight = "600";
    mensajeVacio.style.marginTop = "20px";

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function formatearPrecio(num) {
        try {
            return new Intl.NumberFormat("es-ES").format(num);
        } catch (e) {
            return String(num);
        }
    }

    // badge
    function updateCartBadge() {
        const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];
        const total = carritoLocal.reduce((acc, p) => acc + (Number(p.cantidad) || 1), 0);
        const icon = document.querySelector(".nav-right .icon") || document.querySelector(".icon");
        if (!icon) return;
        const cs = window.getComputedStyle(icon);
        if (cs.position === "static") icon.style.position = "relative";
        let badge = icon.querySelector(".cart-badge");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "cart-badge";
            badge.style.position = "absolute";
            badge.style.top = "-6px";
            badge.style.right = "-6px";
            badge.style.background = "#e53935";
            badge.style.color = "#fff";
            badge.style.borderRadius = "999px";
            badge.style.padding = "2px 6px";
            badge.style.fontSize = "12px";
            badge.style.fontWeight = "700";
            badge.style.lineHeight = "1";
            badge.style.minWidth = "20px";
            badge.style.textAlign = "center";
            icon.appendChild(badge);
        }
        if (total > 0) {
            badge.textContent = total;
            badge.style.display = "inline-block";
        } else {
            badge.style.display = "none";
        }
    }

    function actualizarCarrito() {
        contenedorProductos.innerHTML = "";

        if (!carrito || carrito.length === 0) {
            contenedorProductos.appendChild(mensajeVacio);
            totalElement.textContent = "Total: $0";
            localStorage.setItem("carrito", JSON.stringify([]));
            updateCartBadge();
            return;
        }

        let total = 0;

        carrito.forEach((item, index) => {
            const fila = document.createElement("div");
            fila.classList.add("producto-fila");

            const precioUnitario = Number(item.precio) || 0;
            const cantidad = Number(item.cantidad) || 1;
            const subtotal = precioUnitario * cantidad;
            total += subtotal;

            fila.innerHTML = `
        <div class="col-imagen"><img src="${item.imagen}" alt="${item.nombre}" style="max-width:80px;"/></div>
        <div class="col-divisor"></div>
        <div class="col-detalles">
        <strong>${item.nombre}</strong><br/>Ref: ${item.ref || "N/A"}<br/>Material: ${item.material || "—"}
        </div>
        <div class="col-examen">—</div>
        <div class="col-precio">
        <div>Unit: $${formatearPrecio(precioUnitario)}</div>
        <div>Cant: <input type="number" min="1" value="${cantidad}" class="cantidad-input" data-index="${index}" style="width:60px;"/></div>
        <div>Subtotal: $${formatearPrecio(subtotal)}</div>
        </div>
        <div class="col-eliminar"><button class="btn-eliminar" data-index="${index}">×</button></div>`;

            contenedorProductos.appendChild(fila);
        });

        totalElement.textContent = `Total: $${formatearPrecio(total)}`;

        // listeners eliminar
        document.querySelectorAll(".btn-eliminar").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const i = Number(e.currentTarget.dataset.index);
                if (!Number.isNaN(i)) {
                    carrito.splice(i, 1);
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    actualizarCarrito();
                    updateCartBadge();
                }
            });
        });

        // listeners cantidad
        document.querySelectorAll(".cantidad-input").forEach((input) => {
            input.addEventListener("change", (e) => {
                const i = Number(e.currentTarget.dataset.index);
                let v = Number(e.currentTarget.value);
                if (Number.isNaN(v) || v < 1) v = 1;
                if (!Number.isNaN(i) && carrito[i]) {
                    carrito[i].cantidad = v;
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    actualizarCarrito();
                    updateCartBadge();
                }
            });
        });

        // actualizar badge también cuando se renderiza
        updateCartBadge();
    }

    // iniciar
    actualizarCarrito();
});
