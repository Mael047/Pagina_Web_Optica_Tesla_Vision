document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector(".container-catalogo");
    const marcaSelect = document.getElementById("marca");
    const materialSelect = document.getElementById("material");

    // 🔹 leemos qué categoría debe mostrar esta página (gafas, accesorio, etc.)
    const categoriaPagina = (document.body.dataset.categoria || "").toLowerCase();

    let productos = []; // lo que viene de la BD

    // 1) Traer productos desde el backend
    fetch("api/get/productos.php")
        .then(res => res.json())
        .then(data => {
            productos = data || [];
            renderProductos();
        })
        .catch(err => {
            console.error("Error cargando productos:", err);
            if (contenedor) {
                contenedor.innerHTML = "<p>Error cargando el catálogo.</p>";
            }
        });

    // 2) Render según filtros
    function renderProductos() {
        if (!contenedor) return;

        contenedor.innerHTML = "";

        const marcaFiltro = marcaSelect ? marcaSelect.value : "todos";
        const materialFiltro = materialSelect ? materialSelect.value : "todos";

        productos.forEach(p => {
            const marcaProd = (p.marca || "").trim();
            const materialProd = (p.material || "").trim();
            const categoriaProd = (p.categoria || "").trim().toLowerCase(); // 🔹 viene de la BD

            // 🔹 filtro por categoría según la página
            const coincideCategoria =
                !categoriaPagina || categoriaProd === categoriaPagina;

            const coincideMarca =
                !marcaSelect || marcaFiltro === "todos" || marcaProd === marcaFiltro;
            const coincideMaterial =
                !materialSelect || materialFiltro === "todos" || materialProd === materialFiltro;

            // si no coincide con algo, no se muestra
            if (!coincideCategoria || !coincideMarca || !coincideMaterial) return;

            const card = document.createElement("div");
            card.className = "producto";
            card.dataset.id = p.id;
            card.dataset.marca = marcaProd;
            card.dataset.material = materialProd;
            card.dataset.categoria = categoriaProd;

            const valor = Number(p.valor || 0);
            const descuentoVal = Number(p.descuento || 0);
            const hayDescuento = descuentoVal > 0;

            const precioOriginal = valor.toLocaleString("es-CO");
            let precioHtml = "";

            if (hayDescuento) {
                const precioDesc = descuentoVal.toLocaleString("es-CO");
                precioHtml = `
                    <div class="precio">
                        <span class="precio-original">${precioOriginal}</span>
                        <span class="precio-descuento">${precioDesc}</span>
                    </div>
                `;
            } else {
                precioHtml = `<p class="precio">${precioOriginal}</p>`;
            }

            card.innerHTML = `
                <figure>
                    <img src="imagenes/${p.imagen}" alt="${p.nombre}">
                </figure>
                <h3>${p.nombre}</h3>
                <h5>Referencia: ${p.referencia}</h5>
                <h3>${p.material}</h3>
                ${precioHtml}
            `;

            // Al hacer clic, ir a detalle
            card.addEventListener("click", () => {
                window.location.href = "producto.html?ref=" + encodeURIComponent(p.referencia);
            });

            contenedor.appendChild(card);
        });

        if (!contenedor.children.length) {
            contenedor.innerHTML = "<p>No se encontraron productos con estos filtros.</p>";
        }
    }

    // 3) Filtros
    if (marcaSelect) {
        marcaSelect.addEventListener("change", renderProductos);
    }
    if (materialSelect) {
        materialSelect.addEventListener("change", renderProductos);
    }
});
