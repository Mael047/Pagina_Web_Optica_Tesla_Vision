document.addEventListener("DOMContentLoaded", () => {
    const carrusel = document.querySelector(".carrusel .item");
    const imagenes = carrusel ? carrusel.querySelectorAll("img") : [];
    const puntos   = document.querySelectorAll(".carrusel .punto");

    if (!carrusel || !imagenes.length) return;

    let indice = 0;
    const total = imagenes.length;
    let intervalo = null;

    // Función para actualizar el carrusel
    const actualizarCarrusel = () => {
        // Cada slide ocupa el 100%, así que movemos en múltiplos de 100%
        carrusel.style.transform = `translateX(-${indice * 100}%)`;

        puntos.forEach((p, i) => {
            p.classList.toggle("activo", i === indice);
        });
    };

    // Función para pasar a la siguiente imagen
    const siguiente = () => {
        indice = (indice + 1) % total;
        actualizarCarrusel();
    };

    // Iniciar carrusel automático (solo si hay más de una imagen)
    const iniciarAuto = () => {
        if (total <= 1) return;
        intervalo = setInterval(siguiente, 4000); // cambia cada 4 segundos
    };

    const reiniciarAuto = () => {
        if (intervalo) clearInterval(intervalo);
        iniciarAuto();
    };

    // Detectar clic en los puntos
    puntos.forEach((punto, i) => {
        punto.addEventListener("click", () => {
            indice = i;
            actualizarCarrusel();
            reiniciarAuto();
        });
    });

    // (Opcional) Pausar el auto-slide al pasar el mouse
    const contenedorCarrusel = document.querySelector(".carrusel");
    if (contenedorCarrusel) {
        contenedorCarrusel.addEventListener("mouseenter", () => {
            if (intervalo) clearInterval(intervalo);
        });
        contenedorCarrusel.addEventListener("mouseleave", reiniciarAuto);
    }

    // Ajustar al cambiar el tamaño de la ventana (por si cambian los breakpoints)
    window.addEventListener("resize", actualizarCarrusel);

    // Inicialización
    actualizarCarrusel();
    iniciarAuto();
});
