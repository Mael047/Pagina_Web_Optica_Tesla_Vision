document.addEventListener('DOMContentLoaded', async () => {
    const ofertasGrid = document.getElementById('ofertasGrid');
    
    if (!ofertasGrid) return;

    try {
        const response = await fetch('api/get/productos.php');
        const productos = await response.json();
        
        const ofertas = productos.filter(p => p.descuento > 0 && p.descuento < p.valor);
        
        if (ofertas.length === 0) {
            ofertasGrid.innerHTML = '<p style="text-align:center; width:100%;">No hay ofertas disponibles</p>';
            return;
        }

        ofertasGrid.innerHTML = ofertas.slice(0, 4).map(producto => {
            const descuento = Math.round((1 - producto.descuento / producto.valor) * 100);
            return `
                <div class="oferta-card">
                    <span class="oferta-badge">-${descuento}%</span>
                    <div class="producto-icono">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="white">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                    </div>
                    <div class="oferta-card-content">
                        <h3>${producto.nombre}</h3>
                        <p class="marca">${producto.marca}</p>
                        <div class="precios">
                            <span class="precio-original">$${Number(producto.valor).toLocaleString('es-CO')}</span>
                            <span class="precio-oferta">$${Number(producto.descuento).toLocaleString('es-CO')}</span>
                        </div>
                        <a href="producto.html?ref=${producto.referencia}" class="btn-comprar">Ver Detalles</a>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error al cargar ofertas:', error);
        ofertasGrid.innerHTML = '<p style="text-align:center; width:100%;">Error al cargar ofertas</p>';
    }
});
