document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    console.log("ID del producto:", id);
    // Aquí podrías buscar los datos desde un JSON, un array o Firebase
    // y llenar dinámicamente la página
  } else {
    console.error("No se proporcionó un ID de producto");
  }
});