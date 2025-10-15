document.addEventListener("DOMContentLoaded", () => {
  const iconoCarrito = document.querySelector(".icon svg");
  const carrito = document.getElementById("carrito");
  const contenedor = document.getElementById("tabla-carrito");
  const vacio = document.querySelector(".carrito-vacio");
  const footer = document.querySelector(".carrito-footer");
  const totalEl = document.getElementById("carrito-total");

  let total = 0;

  // Mostrar/Ocultar carrito
  iconoCarrito.addEventListener("click", () => {
    carrito.style.display = carrito.style.display === "block" ? "none" : "block";
  });

  // 🔧 Función para agregar producto
  function agregarProducto(producto) {
    vacio.style.display = "none";
    contenedor.style.display = "block";
    footer.style.display = "block";

    const item = document.createElement("div");
    item.classList.add("carrito-item");

    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="carrito-info">
        <p class="nombre">${producto.nombre}</p>
        <p>Referencia: ${producto.referencia}</p>
        <p>Material: ${producto.material}</p>
        <p>Examen: ${producto.examen ? "Sí" : "No"}</p>
        <p class="tachado">$${producto.precioOriginal}</p>
        <p>$${producto.precio}</p>
      </div>
      <button class="btn-eliminar">X</button>
    `;

    contenedor.appendChild(item);
    total += producto.precio;
    totalEl.textContent = total;

    // Eliminar producto
    item.querySelector(".btn-eliminar").addEventListener("click", () => {
      item.remove();
      total -= producto.precio;
      totalEl.textContent = total;
      if (contenedor.children.length === 0) {
        vacio.style.display = "block";
        contenedor.style.display = "none";
        footer.style.display = "none";
      }
    });
  }

  // 🔹 Ejemplo de uso (temporal)
  // Puedes llamarlo desde cualquier parte de tu sitio
  window.agregarProductoAlCarrito = agregarProducto;
});
