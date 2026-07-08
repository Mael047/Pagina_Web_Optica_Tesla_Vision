document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("hero-galeria");
    if (!container) return;

    const VELOCIDAD = 40;

    fetch("api/get/galeria.php")
        .then(r => r.json())
        .then(data => {
            if (!data.length) {
                container.innerHTML = `
                    <div class="collage-placeholder">
                        <div class="placeholder-box"></div>
                        <div class="placeholder-box"></div>
                        <div class="placeholder-box"></div>
                    </div>
                `;
                return;
            }

            const imagenes = data.map(g => "imagenes/" + g.imagen);
            const repeticiones = imagenes.length < 4 ? 4 : 2;
            let duplicadas = [];
            for (let r = 0; r < repeticiones; r++) {
                duplicadas.push(...imagenes);
            }

            container.innerHTML =
                '<div class="collage-track">' +
                duplicadas.map(src =>
                    '<div class="collage-item" style="background-image: url(' + src + ')"></div>'
                ).join('') +
                '</div>';

            const track = container.querySelector(".collage-track");
            track.style.animation = `collageScroll ${VELOCIDAD}s linear infinite`;
        })
        .catch(() => {
            container.innerHTML = `
                <div class="collage-placeholder">
                    <div class="placeholder-box"></div>
                    <div class="placeholder-box"></div>
                    <div class="placeholder-box"></div>
                </div>
            `;
        });
});
