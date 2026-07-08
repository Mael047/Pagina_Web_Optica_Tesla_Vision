document.addEventListener("DOMContentLoaded", () => {

    const sections = {
        productos: document.getElementById("section-productos"),
        testimonios: document.getElementById("section-testimonios"),
        galeria: document.getElementById("section-galeria"),
        carrusel: document.getElementById("section-carrusel"),
    };

    const navItems = document.querySelectorAll(".sidebar .menu-item");

    function showSection(name) {
        Object.keys(sections).forEach(k => {
            if (sections[k]) sections[k].style.display = k === name ? "block" : "none";
        });
        navItems.forEach(el => {
            el.classList.toggle("active", el.dataset.section === name);
        });
    }

    navItems.forEach(el => {
        el.addEventListener("click", () => showSection(el.dataset.section));
    });

    showSection("productos");

    // ============ TESTIMONIOS ============
    const testimonioForm = document.getElementById("form-testimonio");
    const testimonioList = document.getElementById("lista-testimonios");

    function cargarTestimonios() {
        fetch("api/get/testimonios.php")
            .then(r => r.json())
            .then(data => {
                testimonioList.innerHTML = "";
                data.forEach(t => {
                    const div = document.createElement("div");
                    div.className = "admin-list-item";
                    const imgHtml = t.imagen ? `<img src="imagenes/${t.imagen}" class="admin-thumb">` : "";
                    div.innerHTML = `
                        ${imgHtml}
                        <div class="admin-item-info">
                            <strong>${t.nombre}</strong>
                            <p>${t.comentario}</p>
                        </div>
                        <button class="btnEdit" data-id="${t.id}" data-nombre="${t.nombre}" data-comentario="${t.comentario}" data-imagen="${t.imagen || ''}">Editar</button>
                        <button class="btnDelete" data-id="${t.id}">Eliminar</button>
                    `;
                    testimonioList.appendChild(div);
                });
                div.addEventListener("click", (e) => {
                    const btnEdit = e.target.closest(".btnEdit");
                    const btnDelete = e.target.closest(".btnDelete");
                    if (btnEdit) {
                        document.getElementById("test-id").value = btnEdit.dataset.id;
                        document.getElementById("test-nombre").value = btnEdit.dataset.nombre;
                        document.getElementById("test-comentario").value = btnEdit.dataset.comentario;
                    }
                    if (btnDelete) eliminarTestimonio(btnDelete.dataset.id);
                });
            });
    }

    function eliminarTestimonio(id) {
        if (!confirm("¿Eliminar este testimonio?")) return;
        fetch("api/delete/eliminar_testimonio.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        }).then(r => r.json()).then(res => {
            alert(res.mensaje);
            cargarTestimonios();
            limpiarFormTestimonio();
        });
    }

    if (testimonioForm) {
        testimonioForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById("test-id").value,
                nombre: document.getElementById("test-nombre").value,
                comentario: document.getElementById("test-comentario").value,
            };
            const fileInput = document.getElementById("test-imagen");
            if (fileInput && fileInput.files.length > 0) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    data.imagen = ev.target.result;
                    enviarTestimonio(data);
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                enviarTestimonio(data);
            }
        });
    }

    function enviarTestimonio(data) {
        fetch("api/post/testimonio.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(r => r.json()).then(res => {
            alert(res.mensaje);
            if (res.status === "success") {
                cargarTestimonios();
                limpiarFormTestimonio();
            }
        });
    }

    function limpiarFormTestimonio() {
        document.getElementById("test-id").value = "";
        document.getElementById("test-nombre").value = "";
        document.getElementById("test-comentario").value = "";
        document.getElementById("test-imagen").value = "";
    }

    // ============ GALERIA ============
    const galeriaForm = document.getElementById("form-galeria");
    const galeriaList = document.getElementById("lista-galeria");

    function cargarGaleria() {
        fetch("api/get/galeria.php")
            .then(r => r.json())
            .then(data => {
                galeriaList.innerHTML = "";
                data.forEach(g => {
                    const div = document.createElement("div");
                    div.className = "admin-list-item";
                    div.innerHTML = `
                        <img src="imagenes/${g.imagen}" class="admin-thumb">
                        <div class="admin-item-info"><span>${g.imagen}</span></div>
                        <button class="btnDelete" data-id="${g.id}">Eliminar</button>
                    `;
                    galeriaList.appendChild(div);
                });
                div.addEventListener("click", (e) => {
                    const btn = e.target.closest(".btnDelete");
                    if (btn) eliminarGaleria(btn.dataset.id);
                });
            });
    }

    function eliminarGaleria(id) {
        if (!confirm("¿Eliminar esta imagen?")) return;
        fetch("api/delete/eliminar_galeria.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        }).then(r => r.json()).then(res => {
            alert(res.mensaje);
            cargarGaleria();
        });
    }

    if (galeriaForm) {
        galeriaForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const fileInput = document.getElementById("gal-imagen");
            if (!fileInput || !fileInput.files.length) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                fetch("api/post/galeria.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imagen: ev.target.result })
                }).then(r => r.json()).then(res => {
                    alert(res.mensaje);
                    if (res.status === "success") {
                        cargarGaleria();
                        fileInput.value = "";
                    }
                });
            };
            reader.readAsDataURL(fileInput.files[0]);
        });
    }

    // ============ CARRUSEL ============
    const carruselForm = document.getElementById("form-carrusel");
    const carruselList = document.getElementById("lista-carrusel");

    function cargarCarrusel() {
        fetch("api/get/carrusel.php")
            .then(r => r.json())
            .then(data => {
                carruselList.innerHTML = "";
                data.forEach(c => {
                    const div = document.createElement("div");
                    div.className = "admin-list-item";
                    div.innerHTML = `
                        <img src="imagenes/${c.imagen}" class="admin-thumb">
                        <div class="admin-item-info"><span>${c.imagen}</span></div>
                        <button class="btnDelete" data-id="${c.id}">Eliminar</button>
                    `;
                    carruselList.appendChild(div);
                });
                div.addEventListener("click", (e) => {
                    const btn = e.target.closest(".btnDelete");
                    if (btn) eliminarCarrusel(btn.dataset.id);
                });
            });
    }

    function eliminarCarrusel(id) {
        if (!confirm("¿Eliminar esta imagen?")) return;
        fetch("api/delete/eliminar_carrusel.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        }).then(r => r.json()).then(res => {
            alert(res.mensaje);
            cargarCarrusel();
        });
    }

    if (carruselForm) {
        carruselForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const fileInput = document.getElementById("car-imagen");
            const ordenInput = document.getElementById("car-orden");
            if (!fileInput || !fileInput.files.length) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                fetch("api/post/carrusel.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        imagen: ev.target.result,
                        orden: parseInt(ordenInput.value) || 0
                    })
                }).then(r => r.json()).then(res => {
                    alert(res.mensaje);
                    if (res.status === "success") {
                        cargarCarrusel();
                        fileInput.value = "";
                    }
                });
            };
            reader.readAsDataURL(fileInput.files[0]);
        });
    }

    // Cargar listas al iniciar cada seccion
    const origShowSection = showSection;
    showSection = function(name) {
        origShowSection(name);
        if (name === "testimonios") cargarTestimonios();
        if (name === "galeria") cargarGaleria();
        if (name === "carrusel") cargarCarrusel();
    };
    window.showSection = showSection;
});
