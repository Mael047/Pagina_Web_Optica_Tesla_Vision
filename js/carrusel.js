const item = document.querySelector('.item');
const punto = document.querySelectorAll('.punto');

//Recorrer los puntos
punto.forEach((cadaPunto, i) => {
    punto[i].addEventListener('click', () => {
        console.log("click hecho en el punto " + (i + 1));

        // -25 % para cada imagen ya que hay 4 imágenes
        let posicion = i;
        let operacion = posicion * -25;

        //movimiento de la imagen
        item.style.transform = `translateX(${operacion}%)`;

        punto.forEach((cadaPunto, i) => {  
            punto[i].classList.remove('activo');
        });
        //dejar activo el punto que se ha seleccionado
        punto[i].classList.add('activo'); 
    });
}); 