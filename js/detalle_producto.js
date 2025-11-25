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

    // ===== IM�?GENES DEL CARRUSEL =====
    const imgs = document.querySelectorAll('.carrusel .img');

    const esImagenValida = (nombre) => {
        const val = (nombre || '').trim();
        if (!val) return false;
        const low = val.toLowerCase();
        // Evitar textos devueltos por el backend como "No se recibio ninguna imagen"
        if (low.includes('no se recibi') || low.includes('ninguna imagen')) return false;
        return true;
    };

    const fuentesBase = [p.imagen, p.imagen2, p.imagen3].filter(esImagenValida);

    if (!fuentesBase.length) {
        return; // sin fuentes válidas, no forzamos src para evitar 404
    }

    let fuentes = [];
    if (fuentesBase.length === 1) {
        fuentes = [fuentesBase[0], fuentesBase[0], fuentesBase[0]];
    } else if (fuentesBase.length === 2) {
        fuentes = [fuentesBase[0], fuentesBase[1], fuentesBase[1]];
    } else {
        fuentes = fuentesBase;
    }

    imgs.forEach((imgEl, idx) => {
        const src = fuentes[idx] || fuentes[0];
        if (!imgEl || !src) return;
        imgEl.src = 'imagenes/' + src;
        imgEl.alt = p.nombre || 'Producto';
    });

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
