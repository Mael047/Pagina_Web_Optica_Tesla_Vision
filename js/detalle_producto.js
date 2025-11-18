document.addEventListener('DOMContentLoaded', () => {
    // 1) Leer ?ref= de la URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('referencia');

    if (!ref) {
        console.error('No se proporcionó referencia en la URL');
        mostrarMensajeError('No se encontró el producto.');
        return;
    }

    // 2) Pedir el producto al backend usando referencia
    fetch('api/get/producto.php?ref=' + encodeURIComponent(ref))
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                mostrarMensajeError('No se encontró el producto.');
                return;
            }
            renderProducto(data);
        })
        .catch(err => {
            console.error('Error cargando producto:', err);
            mostrarMensajeError('Error al cargar el producto.');
        });
});

function formatearCOP(valor) {
    return Number(valor || 0).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    });
}

function renderProducto(p) {
    const contenedor = document.querySelector('.container-producto');
    if (!contenedor) return;

    const titulo = document.querySelector('.detalles-producto h1');
    const refEl = document.querySelector('.detalles-producto h3');
    const matEl = document.querySelector('.detalles-producto h2');
    const precioEl = document.querySelector('.detalles-producto .precio');

    // ===== TÍTULOS, REF, MATERIAL =====
    if (titulo) titulo.textContent = p.nombre || 'Producto';
    if (refEl) refEl.textContent = 'Referencia: ' + (p.referencia || '');
    if (matEl) matEl.textContent = 'Material: ' + (p.material || '');

    // ===== IMAGEN PRINCIPAL DEL CARRUSEL (SOLO LA PRIMERA) =====
    const imgs = document.querySelectorAll('.carrusel .img');
    if (imgs[0] && p.imagen) { imgs[0].src = 'imagenes/' + p.imagen; imgs[0].alt = p.nombre || 'Producto'; }
    if (imgs[1] && p.imagen2) { imgs[1].src = 'imagenes/' + p.imagen2; imgs[1].alt = p.nombre || 'Producto'; }
    if (imgs[2] && p.imagen3) { imgs[2].src = 'imagenes/' + p.imagen3; imgs[2].alt = p.nombre || 'Producto'; }

    // si faltan imagen2/3, puedes reutilizar la primera:
    if (imgs[1] && !p.imagen2 && p.imagen) imgs[1].src = 'imagenes/' + p.imagen;
    if (imgs[2] && !p.imagen3 && p.imagen) imgs[2].src = 'imagenes/' + p.imagen;

    // ===== PRECIO =====
    if (precioEl) {
        const valor = Number(p.valor || 0);
        const descuento = Number(p.descuento || 0);
        const tieneDesc = descuento > 0;

        precioEl.dataset.precio = valor || 0;
        precioEl.dataset.descuento = descuento || 0;

        const precioMostrar = tieneDesc ? descuento : valor;
        precioEl.textContent = formatearCOP(precioMostrar);
    }

    // ===== BREADCRUMB =====
    const breadcrumbActive = document.querySelector('.breadcrumb .active');
    if (breadcrumbActive && p.nombre) {
        breadcrumbActive.textContent = p.nombre;
    }
}

function mostrarMensajeError(msg) {
    const contenedor = document.querySelector('.container-producto');
    if (contenedor) {
        contenedor.innerHTML = '<p>' + msg + '</p>';
    }
}
