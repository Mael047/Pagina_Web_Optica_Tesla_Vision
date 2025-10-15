document.addEventListener("DOMContentLoaded", () => {
    const carrusel = document.querySelector(".carrusel .item");
    const imagenes = document.querySelectorAll(".carrusel .item img");
    const puntos = document.querySelectorAll(".carrusel .punto");

    let indice = 0;
    const total = imagenes.length;

    // Función para actualizar el carrusel
    const actualizarCarrusel = () => {
        const ancho = imagenes[0].clientWidth;
        carrusel.style.transform = `translateX(-${indice * ancho}px)`;

        puntos.forEach((p, i) => {
            p.classList.toggle("activo", i === indice);
        });
    };

    // Detectar clic en los puntos
    puntos.forEach((punto, i) => {
        punto.addEventListener("click", () => {
            indice = i;
            actualizarCarrusel();
        });
    });

    // Carrusel automático
    setInterval(() => {
        indice = (indice + 1) % total;
        actualizarCarrusel();
    }, 4000); // cambia cada 4 segundos

    // Ajustar cuando cambia el tamaño de la ventana
    window.addEventListener("resize", actualizarCarrusel);

    // Inicialización
    actualizarCarrusel();
});
