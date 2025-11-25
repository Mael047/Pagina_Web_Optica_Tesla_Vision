let productosCache = []; // para poder encontrar el producto al editar

window.onload = function () {
    const formulario = document.getElementById("formulario");

    const imgInput1 = document.getElementById("imagen");
    const imgInput2 = document.getElementById("imagen2");
    const imgInput3 = document.getElementById("imagen3");

    const preview1 = document.getElementById("preview1");
    const preview2 = document.getElementById("preview2");
    const preview3 = document.getElementById("preview3");

    // Cargar lista al inicio
    ajaxGet("api/get/productos.php");

    // ----- ENVÍO DEL FORMULARIO (crear o editar) -----
    if (formulario) {
        formulario.onsubmit = function (event) {
            event.preventDefault();

            const datos = new FormData(formulario);
            const dataObjeto = Object.fromEntries(datos.entries());

            // Si referencia_original tiene algo -> estamos EDITANDO
            const refOriginal = (dataObjeto.referencia_original || "").trim();
            const esEdicion = refOriginal !== "";

            const url = esEdicion
                ? "api/post/actualizar_producto.php"
                : "api/post/registro.php";

            console.log(
                "Modo de envío:",
                esEdicion ? "EDICION" : "CREACION",
                "URL:",
                url,
                dataObjeto
            );

            // Reunir inputs de imagen presentes
            const imagenes = [];
            if (imgInput1 && imgInput1.files.length > 0) {
                imagenes.push({ input: imgInput1, field: "imagen" });
            }
            if (imgInput2 && imgInput2.files.length > 0) {
                imagenes.push({ input: imgInput2, field: "imagen2" });
            }
            if (imgInput3 && imgInput3.files.length > 0) {
                imagenes.push({ input: imgInput3, field: "imagen3" });
            }

            if (imagenes.length === 0) {
                // sin nuevas imágenes
                ajaxPost(url, dataObjeto);
            } else {
                // leer todas las imágenes en paralelo
                let pendientes = imagenes.length;
                imagenes.forEach((info) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        dataObjeto[info.field] = e.target.result; // base64
                        pendientes--;
                        if (pendientes === 0) {
                            ajaxPost(url, dataObjeto);
                        }
                    };
                    reader.readAsDataURL(info.input.files[0]);
                });
            }
        };
    }

    // ----- PREVIEWS -----
    setupPreview(imgInput1, preview1);
    setupPreview(imgInput2, preview2);
    setupPreview(imgInput3, preview3);
};

// ---------- Helpers de preview ----------
function setupPreview(fileInput, imgPreview) {
    if (!fileInput || !imgPreview) return;

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            imgPreview.src = e.target.result;
            imgPreview.style.display = "block";

            const placeholder = imgPreview.closest(".image-placeholder");
            if (placeholder) {
                const icon = placeholder.querySelector(".placeholder-icon");
                const text = placeholder.querySelector(".placeholder-text");
                if (icon) icon.style.display = "none";
                if (text) text.style.display = "none";
            }
        };
        reader.readAsDataURL(file);
    });
}

function mostrarPreviewExistente(previewId, fileName) {
    const img = document.getElementById(previewId);
    if (!img) return;

    const placeholder = img.closest(".image-placeholder");
    const icon = placeholder ? placeholder.querySelector(".placeholder-icon") : null;
    const text = placeholder ? placeholder.querySelector(".placeholder-text") : null;

    if (fileName) {
        img.src = "imagenes/" + fileName;
        img.style.display = "block";
        if (icon) icon.style.display = "none";
        if (text) text.style.display = "none";
    } else {
        img.src = "";
        img.style.display = "none";
        if (icon) icon.style.display = "block";
        if (text) text.style.display = "block";
    }
}

// ----- AJAX POST -----
function ajaxPost(url, dataObjeto) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                responseServer(xhr.responseText);
            } else {
                console.error("Error en la solicitud:", xhr.statusText);
            }
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(dataObjeto));
}

// ----- AJAX GET -----
function ajaxGet(url) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                responseServerGet(xhr.responseText);
            } else {
                console.error("Error en la solicitud:", xhr.statusText);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send();
}

// ----- RESPUESTA DEL SERVIDOR (crear / editar / eliminar) -----
function responseServer(response) {
    let jsonResponse;
    try {
        jsonResponse = JSON.parse(response);
    } catch (e) {
        console.error("Respuesta no JSON:", response);
        return;
    }

    console.log("Respuesta del servidor:", jsonResponse);

    const respuestaSpan = document.getElementById("respuesta");
    if (respuestaSpan) {
        respuestaSpan.textContent = jsonResponse.mensaje || "";
    }

    // Recargar lista
    ajaxGet("api/get/productos.php");

    // Limpiar modo edición
    limpiarFormulario();
}

// ----- RENDER LISTA EN ADMIN -----
function responseServerGet(response) {
    let productos;
    try {
        productos = JSON.parse(response);
    } catch (e) {
        console.error("Respuesta GET no JSON:", response);
        return;
    }

    console.log("Productos recibidos:", productos);

    productosCache = productos;

    const productosList = document.getElementById("productos");
    const emptyState = document.querySelector(".empty-state");

    if (!productosList) return;

    productosList.innerHTML = "";

    if (emptyState) {
        emptyState.style.display = productos.length ? "none" : "block";
    }

    productos.forEach(function (producto) {
        const li = document.createElement("li");
        li.className = "producto-item";

        const texto = document.createElement("span");
        texto.textContent =
            `${producto.nombre} - ${producto.referencia} - ${producto.categoria}`;

        // Boton EDITAR
        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Editar";
        btnEdit.className = "btnEdit";
        btnEdit.onclick = function () {
            cargarProductoEnFormulario(producto);
        };

        // Boton ELIMINAR
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Eliminar";
        btnDelete.className = "btnDelete";
        btnDelete.onclick = function () {
            eliminarProducto(producto.referencia);
        };

        li.appendChild(texto);
        li.appendChild(btnEdit);
        li.appendChild(btnDelete);
        productosList.appendChild(li);
    });

    if (typeof updateAdminEmptyState === "function") {
        updateAdminEmptyState();
    }
}

// ----- LLENAR FORMULARIO PARA EDITAR -----
function cargarProductoEnFormulario(producto) {
    const campoProducto = document.getElementById("producto");
    const campoCategoria = document.getElementById("categoria");
    const campoMaterial = document.getElementById("material");
    const campoValor = document.getElementById("valor");
    const campoDescuento = document.getElementById("descuento");
    const campoReferencia = document.getElementById("referencia");
    const campoDesc = document.getElementById("descripcion");
    const refOriginal = document.getElementById("referencia_original");

    if (campoProducto) campoProducto.value = producto.nombre || "";
    if (campoCategoria) campoCategoria.value = producto.categoria || "";
    if (campoMaterial) campoMaterial.value = producto.material || "";
    if (campoValor) campoValor.value = producto.valor || "";
    if (campoDescuento) campoDescuento.value = producto.descuento || "";
    if (campoReferencia) campoReferencia.value = producto.referencia || "";
    if (campoDesc) campoDesc.value = producto.descripcion || "";
    if (refOriginal) refOriginal.value = producto.referencia || "";

    // Mostrar imagenes actuales (si existen en BD)
    mostrarPreviewExistente("preview1", producto.imagen);
    mostrarPreviewExistente("preview2", producto.imagen2);
    mostrarPreviewExistente("preview3", producto.imagen3);

    // Mostrar el formulario si estaba oculto
    const formSection = document.querySelector(".product-form");
    if (typeof showAdminForm === "function") {
        showAdminForm();
    } else if (formSection) {
        formSection.classList.remove("hidden");
        formSection.classList.add("visible");
        const emptyState = document.querySelector(".empty-state");
        if (emptyState) emptyState.style.display = "none";
    }
}


// ----- ELIMINAR PRODUCTO -----
function eliminarProducto(referencia) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
    ajaxPost("api/delete/eliminar_producto.php", { referencia: referencia });
}

// ----- LIMPIAR FORMULARIO Y SALIR DE MODO EDICIÓN -----
function limpiarFormulario() {
    const formulario = document.getElementById("formulario");
    if (!formulario) return;

    formulario.reset();

    const refOriginal = document.getElementById("referencia_original");
    if (refOriginal) refOriginal.value = "";

    // Limpiar previews
    mostrarPreviewExistente("preview1", null);
    mostrarPreviewExistente("preview2", null);
    mostrarPreviewExistente("preview3", null);
}
