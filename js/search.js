document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const query = (params.get("q") || "").trim();

    const subtitle = document.getElementById("search-subtitle");
    const resultsWrapper = document.getElementById("search-results");
    const searchInput = document.querySelector('.search-box input[name="q"]');

    if (searchInput) searchInput.value = query;
    if (subtitle) {
        subtitle.textContent = query ? `Resultados para "${query}"` : "Explora nuestro catálogo";
    }

    fetch("api/get/productos.php")
        .then(res => res.json())
        .then(data => renderResultados(data || [], query))
        .catch(err => {
            console.error("Error en búsqueda", err);
            if (resultsWrapper) {
                resultsWrapper.innerHTML = '<p class="search-empty">No se pudieron cargar los productos.</p>';
            }
        });

    function renderResultados(productos, q) {
        if (!resultsWrapper) return;

        let lista = productos;
        if (q) {
            const qLower = q.toLowerCase();
            lista = productos.filter(p => {
                const nombre = (p.nombre || "").toLowerCase();
                const marca = (p.marca || "").toLowerCase();
                return nombre.includes(qLower) || marca.includes(qLower);
            });
        }

        if (!lista.length) {
            resultsWrapper.innerHTML = '<p class="search-empty">No encontramos productos que coincidan.</p>';
            return;
        }

        const grid = document.createElement("div");
        grid.className = "search-grid";

        lista.forEach(p => {
            const card = document.createElement("div");
            card.className = "search-card";

            const valor = Number(p.valor || 0);
            const precioFmt = new Intl.NumberFormat("es-CO").format(valor);

            card.innerHTML = `
                <figure>
                    <img src="imagenes/${p.imagen}" alt="${p.nombre}">
                </figure>
                <h3>${p.nombre || "Producto"}</h3>
                <div class="marca">${p.marca || ""}</div>
                <div class="precio">$${precioFmt}</div>
            `;

            card.addEventListener("click", () => {
                if (p.referencia) {
                    window.location.href = "producto.html?ref=" + encodeURIComponent(p.referencia);
                }
            });

            grid.appendChild(card);
        });

        resultsWrapper.innerHTML = "";
        resultsWrapper.appendChild(grid);
    }
});
