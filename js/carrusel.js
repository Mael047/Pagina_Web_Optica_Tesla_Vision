document.addEventListener("DOMContentLoaded", () => {
    const carruselItem = document.querySelector(".carrusel .item");
    const puntosContainer = document.querySelector(".carrusel .puntos");
    if (!carruselItem) return;

    fetch("api/get/carrusel.php")
        .then(r => r.json())
        .then(data => {
            if (!data.length) {
                carruselItem.innerHTML = '<img src="img/carrusel1_p.png" alt="Placeholder" class="img">';
                if (puntosContainer) {
                    puntosContainer.innerHTML = '<li class="punto activo"></li>';
                }
                initCarrusel();
                return;
            }

            carruselItem.innerHTML = data.map(g =>
                `<img src="imagenes/${g.imagen}" alt="Carrusel" class="img">`
            ).join('');

            if (puntosContainer) {
                puntosContainer.innerHTML = data.map((_, i) =>
                    `<li class="punto ${i === 0 ? 'activo' : ''}"></li>`
                ).join('');
            }

            initCarrusel();
        })
        .catch(() => {
            carruselItem.innerHTML = '<img src="img/carrusel1_p.png" alt="Placeholder" class="img">';
            if (puntosContainer) {
                puntosContainer.innerHTML = '<li class="punto activo"></li>';
            }
            initCarrusel();
        });

    function initCarrusel() {
        const imagenes = carruselItem.querySelectorAll("img");
        const puntos = document.querySelectorAll(".carrusel .punto");
        if (!imagenes.length) return;

        let indice = 0;
        const total = imagenes.length;

        function actualizarCarrusel() {
            const ancho = imagenes[0].clientWidth;
            carruselItem.style.transform = `translateX(-${indice * ancho}px)`;
            puntos.forEach((p, i) => p.classList.toggle("activo", i === indice));
        }

        puntos.forEach((punto, i) => {
            punto.addEventListener("click", () => {
                indice = i;
                actualizarCarrusel();
            });
        });

        setInterval(() => {
            indice = (indice + 1) % total;
            actualizarCarrusel();
        }, 4000);

        window.addEventListener("resize", actualizarCarrusel);
        actualizarCarrusel();
    }
});
