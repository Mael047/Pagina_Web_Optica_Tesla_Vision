document.addEventListener("DOMContentLoaded", () => {
    const productos = document.querySelectorAll(".producto, .detalles-producto");

    productos.forEach(producto => {
        const precioElemento = producto.querySelector(".precio");
        if (!precioElemento) return;

        const precioOriginal = parseFloat(precioElemento.dataset.precio);
        const precioDescuento = parseFloat(precioElemento.dataset.descuento);

        if (precioDescuento && precioDescuento < precioOriginal) {
            precioElemento.innerHTML = `
        <span class="precio-original">${precioOriginal.toLocaleString()}</span>
        <span class="precio-descuento">${precioDescuento.toLocaleString()}</span>
      `;
        } else {
            precioElemento.innerHTML = `${precioOriginal.toLocaleString()}`;
        }
    });
});