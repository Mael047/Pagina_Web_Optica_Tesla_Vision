// js/profile_admin.js
document.addEventListener("DOMContentLoaded", () => {
    const btnAdd = document.querySelector(".btn-add");
    const productForm = document.querySelector(".product-form");
    const emptyState = document.querySelector(".empty-state");
    const divider = document.querySelector(".divider");
    const btnCancel = document.querySelector(".btn-cancel");

    if (!btnAdd || !productForm) return;

    const hasProducts = () => {
        const list = document.getElementById("productos");
        return !!(list && list.children.length > 0);
    };

    const updateEmptyStateVisibility = () => {
        if (!emptyState) return;
        emptyState.style.display = hasProducts() ? "none" : "block";
    };

    function showForm() {
        if (emptyState) emptyState.style.display = "none";
        if (divider) divider.style.display = "none";

        productForm.classList.remove("hidden");
        productForm.classList.add("visible");

        productForm.scrollIntoView({ behavior: "smooth", block: "start" });

        const firstInput = productForm.querySelector("input, textarea, select");
        if (firstInput) firstInput.focus();
    }

    function hideForm() {
        productForm.classList.remove("visible");
        productForm.classList.add("hidden");

        updateEmptyStateVisibility();
        if (divider) divider.style.display = "";

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    btnAdd.addEventListener("click", (e) => {
        e.preventDefault();
        if (typeof limpiarFormulario === "function") {
            limpiarFormulario();
        }
        showForm();
    });

    if (btnCancel) {
        btnCancel.addEventListener("click", (e) => {
            e.preventDefault();
            if (typeof limpiarFormulario === "function") {
                limpiarFormulario();
            }
            hideForm();
        });
    }

    // Expose helpers for other scripts (e.g., editing a product)
    window.showAdminForm = showForm;
    window.hideAdminForm = hideForm;
    window.updateAdminEmptyState = updateEmptyStateVisibility;

    updateEmptyStateVisibility();
});
