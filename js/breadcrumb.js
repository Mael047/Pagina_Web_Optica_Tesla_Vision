document.addEventListener("DOMContentLoaded", () => {
    const breadcrumb = document.querySelector(".breadcrumb");
    if (!breadcrumb) return;

    const path = window.location.pathname.split("/").filter(Boolean);

    // Primer enlace fijo
    let breadcrumbHTML = `<a href="../index.html">Inicio</a>`;

    // Recorremos las partes del path, pero omitimos la carpeta "pages"
    path.forEach((segment, index) => {
        if (segment.toLowerCase() === "pages") return; // 🚫 omite la carpeta "pages"

        const name = segment
            .replace(".html", "")
            .charAt(0).toUpperCase() + segment.replace(".html", "").slice(1);

        if (index === path.length - 1) {
            breadcrumbHTML += ` / <span class="active">${name}</span>`;
        } else {
            breadcrumbHTML += ` / <a href="${segment}">${name}</a>`;
        }
    });

    breadcrumb.innerHTML = breadcrumbHTML;
});
