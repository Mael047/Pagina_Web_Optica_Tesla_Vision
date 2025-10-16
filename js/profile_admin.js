// js/profile_admin.js
document.addEventListener("DOMContentLoaded", () => {
    const btnAdd = document.querySelector(".btn-add");
    const productForm = document.querySelector(".product-form");
    const emptyState = document.querySelector(".empty-state");
    const divider = document.querySelector(".divider");
    const btnCancel = document.querySelector(".btn-cancel");

    if (!btnAdd || !productForm) return;

    function showForm() {
        // ocultar estado vacío y divider
        if (emptyState) emptyState.style.display = "none";
        if (divider) divider.style.display = "none";

        // mostrar formulario
        productForm.classList.add("visible");
        productForm.classList.remove("hidden");

        // desplazar suavemente al formulario (si la pantalla es pequeña)
        productForm.scrollIntoView({ behavior: "smooth", block: "start" });

        // poner foco en el primer input
        const firstInput = productForm.querySelector("input, textarea, select");
        if (firstInput) firstInput.focus();
    }

    function hideForm() {
        // ocultar formulario
        productForm.classList.remove("visible");
        productForm.classList.add("hidden");

        // mostrar estado vacío y divider de nuevo
        if (emptyState) emptyState.style.display = "";
        if (divider) divider.style.display = "";

        // opcional: desplazar hacia arriba
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    btnAdd.addEventListener("click", (e) => {
        e.preventDefault();
        showForm();
    });

    if (btnCancel) {
        btnCancel.addEventListener("click", (e) => {
            e.preventDefault();
            hideForm();
        });
    }

    // Si quieres que el formulario se quede visible después de recargar (stateful),
    // podrías leer un flag en sessionStorage/localStorage aquí y llamar a showForm().
});
