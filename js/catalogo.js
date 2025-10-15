document.addEventListener("DOMContentLoaded", () => {
    const productos = document.querySelectorAll(".producto");

    productos.forEach(producto => {
        const descuento = producto.getAttribute("data-descuento");
        if (descuento) {
            const p = producto.querySelector("p");
            const textoOriginal = p.textContent.match(/[\d.,]+/)[0]; // Extrae el número
            p.innerHTML = `
                        Precio: <span style="text-decoration: line-through; color: gray;">${textoOriginal}€</span>
                        <span style="color: red; font-weight: bold; margin-left: 8px;">${descuento}€</span>
                    `;
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const productos = document.querySelectorAll(".producto");

    productos.forEach(producto => {
        const descuento = producto.getAttribute("data-descuento");
        if (descuento) {
            const p = producto.querySelector("p");
            const textoOriginal = p.textContent.match(/[\d.,]+/)[0];
            p.innerHTML = `
                        Precio: <span style="text-decoration: line-through; color: gray;">${textoOriginal}€</span>
                        <span style="color: red; font-weight: bold; margin-left: 8px;">${descuento}€</span>
                    `;
        }
    });
});

// --- Filtros ---
document.addEventListener("DOMContentLoaded", () => {
    const marcaSelect = document.getElementById("marca");
    const materialSelect = document.getElementById("material");
    const productos = document.querySelectorAll(".producto");

    function filtrar() {
        const marca = marcaSelect.value;
        const material = materialSelect.value;

        productos.forEach(prod => {
            const prodMarca = prod.getAttribute("data-marca");
            const prodMaterial = prod.getAttribute("data-material");

            const coincideMarca = marca === "todos" || prodMarca === marca;
            const coincideMaterial = material === "todos" || prodMaterial === material;

            prod.style.display = (coincideMarca && coincideMaterial) ? "flex" : "none";
        });
    }

    marcaSelect.addEventListener("change", filtrar);
    materialSelect.addEventListener("change", filtrar);
});