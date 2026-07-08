document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector(".container-catalogo");
    const marcaSelect = document.getElementById("marca");
    const materialSelect = document.getElementById("material");

    const params = new URLSearchParams(window.location.search);
    const categoriaPagina = (params.get("categoria") || document.body.dataset.categoria || "").toLowerCase();
    let productos = [];

    fetch("api/get/productos.php")
        .then(res => res.json())
        .then(data => {
            productos = data || [];
            renderProductos();
        })
        .catch(err => {
            console.error("Error cargando productos:", err);
            if (contenedor) {
                contenedor.innerHTML = "<p style='text-align:center; width:100%; padding:40px;'>Error cargando el catálogo.</p>";
            }
        });

    function renderProductos() {
        if (!contenedor) return;

        contenedor.innerHTML = "";

        const marcaFiltro = marcaSelect ? marcaSelect.value : "todos";
        const materialFiltro = materialSelect ? materialSelect.value : "todos";

        productos.forEach(p => {
            const marcaProd = (p.marca || "").trim();
            const materialProd = (p.material || "").trim();
            const categoriaProd = (p.categoria || "").trim().toLowerCase();

            const coincideCategoria = !categoriaPagina || categoriaProd === categoriaPagina;
            const coincideMarca = !marcaSelect || marcaFiltro === "todos" || marcaProd === marcaFiltro;
            const coincideMaterial = !materialSelect || materialFiltro === "todos" || materialProd === materialFiltro;

            if (!coincideCategoria || !coincideMarca || !coincideMaterial) return;

            const card = document.createElement("div");
            card.className = "producto";
            card.dataset.id = p.id;
            card.dataset.marca = marcaProd;
            card.dataset.material = materialProd;
            card.dataset.categoria = categoriaProd;

            const valor = Number(p.valor || 0);
            const descuentoVal = Number(p.descuento || 0);
            const hayDescuento = descuentoVal > 0 && descuentoVal < valor;

            const precioOriginal = valor.toLocaleString("es-CO");
            let precioHtml = "";
            let badgeHtml = "";
            let imagenHtml = "";

            if (hayDescuento) {
                const precioDesc = descuentoVal.toLocaleString("es-CO");
                const porcentajeDesc = Math.round((1 - descuentoVal / valor) * 100);
                badgeHtml = `<span class="badge-descuento">-${porcentajeDesc}%</span>`;
                precioHtml = `
                    <div class="precio">
                        <span class="precio-original">$${precioOriginal}</span>
                        <span class="precio-descuento">$${precioDesc}</span>
                    </div>
                `;
            } else {
                card.classList.add("sin-oferta");
                precioHtml = `<div class="precio"><span class="precio-descuento">$${precioOriginal}</span></div>`;
            }

            if (p.imagen) {
                imagenHtml = `<img src="imagenes/${p.imagen}" alt="${p.nombre}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                              <div class="producto-placeholder" style="display:none;">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                              </div>`;
            } else {
                imagenHtml = `<div class="producto-placeholder">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                              </div>`;
            }

            card.innerHTML = `
                ${badgeHtml}
                ${imagenHtml}
                <h3>${p.nombre}</h3>
                <h5>${p.marca || ''}</h5>
                <h3>${p.material}</h3>
                ${precioHtml}
            `;

            card.addEventListener("click", () => {
                window.location.href = "producto.html?ref=" + encodeURIComponent(p.referencia);
            });

            contenedor.appendChild(card);
        });

        if (!contenedor.children.length) {
            contenedor.innerHTML = "<p style='text-align:center; width:100%; padding:40px;'>No se encontraron productos con estos filtros.</p>";
        }
    }

    if (marcaSelect) {
        marcaSelect.addEventListener("change", renderProductos);
    }
    if (materialSelect) {
        materialSelect.addEventListener("change", renderProductos);
    }
});
