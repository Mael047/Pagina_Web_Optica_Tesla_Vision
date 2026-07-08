document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("hero-testimonios");
    if (!container) return;

    const VISIBLES = 3;
    const INTERVALO = 5000;

    function posicionAleatoria() {
        const top = 5 + Math.random() * 55;
        const left = Math.random() * 60;
        const rotacion = (Math.random() - 0.5) * 8;
        return { top: top + "%", left: left + "%", transform: `rotate(${rotacion}deg)` };
    }

    fetch("api/get/testimonios.php")
        .then(r => r.json())
        .then(data => {
            if (!data.length) {
                container.innerHTML = '<p class="hero-placeholder">Próximamente testimonios de nuestros clientes</p>';
                return;
            }

            let disponibles = [...data];

            function escoger(evitar) {
                const pool = disponibles.filter(t => !evitar.includes(t));
                if (!pool.length) return null;
                return pool[Math.floor(Math.random() * pool.length)];
            }

            function render() {
                const elegidos = [];
                const idsUsados = [];
                for (let i = 0; i < VISIBLES; i++) {
                    const t = escoger(idsUsados);
                    if (!t) break;
                    elegidos.push(t);
                    idsUsados.push(t);
                }

                container.innerHTML = "";
                elegidos.forEach(t => {
                    const pos = posicionAleatoria();
                    const card = document.createElement("div");
                    card.className = "testimonio-card";
                    card.style.top = pos.top;
                    card.style.left = pos.left;
                    card.style.transform = pos.transform;

                    const foto = t.imagen
                        ? `<img src="imagenes/${t.imagen}" alt="${t.nombre}" class="testimonio-card-foto">`
                        : `<div class="testimonio-card-avatar">${t.nombre.charAt(0).toUpperCase()}</div>`;

                    card.innerHTML =
                        foto +
                        '<div class="testimonio-card-body">' +
                        '<p class="testimonio-card-texto">"' + t.comentario + '"</p>' +
                        '<p class="testimonio-card-nombre">— ' + t.nombre + '</p>' +
                        '</div>';

                    container.appendChild(card);
                });
            }

            render();
            setInterval(render, INTERVALO);
        })
        .catch(() => {
            container.innerHTML = '<p class="hero-placeholder">Cargando testimonios...</p>';
        });
});
