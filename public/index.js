// Arreglo

let productos = [];

// CALLBACK
// function obtenerYdibujarProductos(x1, x2, callback) {
//   let suma = x1 + x2;
//   callback(null, suma);
// }

// obtenerYdibujarProductos(1, 2, function(error, suma) {
//   console.log(suma);
// });

// PROMESAS
// function obtenerYdibujarProductos() {
//   console.log(1);
//   fetch("/productos")
//     .then(response => {
//       console.log(2);
//     })
//     .catch(error => {
//       console.log(error);
//     });
//   console.log(3);
// }

// obtenerYdibujarProductos();

async function obtenerYdibujarProductos() {
  let response = await fetch("/productos");

  if (response.ok) {
    let data = await response.json();
    productos = data.productos;
  }

  let productoCarta = "";
  for (let i = 0; i < productos.length; i++) {
    // productoCarta +=
    //   '<div class="col-sm-12 col-lg-4">' + productos[i].nombre + "</div>";
    productoCarta += `
        <div class="col-sm-12 col-lg-4">
          <div class="card">
            <img
              src="${productos[i].imagen}"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
              <h5 class="card-title">
                ${productos[i].nombre}
                <small>$${productos[i].precio}</small>
              </h5>
              <p class="card-text">
                ${productos[i].descripcion}
              </p>
              <button type="button" class="btn btn-primary" onclick="seleccionarProducto(${productos[i].id})">
                Editar
                <i class="far fa-edit"></i>
              </button>
              <button type="button" class="btn btn-danger" onclick="eliminarProducto(${productos[i].id})">
                Eliminar
                <i class="fa fa-trash"></i>
              </button>
              <a href="#" class="btn btn-primary">Comprar</a>
            </div>
          </div>
        </div>`;
  }

  document.getElementById("productos").innerHTML = productoCarta;
}

obtenerYdibujarProductos();

async function agregarProducto() {
  let nombre = document.getElementById("producto").value;
  let imagen = document.getElementById("imagen").value;
  let precio = document.getElementById("precio").value;
  let descripcion = document.getElementById("descripcion").value;

  let nuevoProducto = {
    id: productos.length + 1,
    nombre: nombre,
    imagen,
    precio,
    descripcion
  };

  let response = await fetch("/productos", {
    method: "POST",
    body: JSON.stringify(nuevoProducto),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    let data = await response.json();
    alert(data.mensaje);
  } else {
    alert("Hubo un error");
  }

  // productos.push(nuevoProducto);
  obtenerYdibujarProductos();
  limpiarTexto();
  $("#formularioProducto").modal("hide");
}

function limpiarTexto() {
  document.getElementById("producto").value = "";
  document.getElementById("imagen").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("descripcion").value = "";
}

let idProducto;
function seleccionarProducto(id) {
  idProducto = id;

  let productoABuscar = productos.find(productoActual => {
    return id == productoActual.id;
  });

  document.getElementById("producto").value = productoABuscar.nombre;
  document.getElementById("imagen").value = productoABuscar.imagen;
  document.getElementById("precio").value = productoABuscar.precio;
  document.getElementById("descripcion").value = productoABuscar.descripcion;

  $("#formularioProducto").modal("show");
}

function _submit(e) {
  e.preventDefault();

  if (idProducto == undefined) {
    agregarProducto();
  } else {
    editarProducto();
  }
}

function editarProducto() {
  let nombre = document.getElementById("producto").value;
  let imagen = document.getElementById("imagen").value;
  let precio = document.getElementById("precio").value;
  let descripcion = document.getElementById("descripcion").value;

  let productoEditado = {
    id: idProducto,
    nombre: nombre,
    imagen,
    precio,
    descripcion
  };

  let index = productos.findIndex(productoActual => {
    return idProducto == productoActual.id;
  });

  productos[index] = productoEditado;
  obtenerYdibujarProductos();
  limpiarTexto();
  $("#formularioProducto").modal("hide");
  idProducto = undefined;
}

function eliminarProducto(idProducto) {
  let index = productos.findIndex(productoActual => {
    return idProducto == productoActual.id;
  });

  productos.splice(index, 1);

  obtenerYdibujarProductos();
}
