const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Función para mostrar el formulario de inicio de sesión
function mostrarLogin() {
    document.getElementById('registro').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

// Función para mostrar el formulario de registro
function mostrarRegistro() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('registro').style.display = 'block';
}

// Evento para mostrar el formulario de inicio de sesión al hacer clic en el enlace
document.getElementById('linkLogin').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarLogin();
});

// Evento para mostrar el formulario de registro al hacer clic en el enlace
document.getElementById('linkRegistro').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarRegistro();
});

// Función para registrar un nuevo usuario
document.getElementById('btnRegistrar').addEventListener('click', () => {
    const nombre = document.getElementById('nombreRegistro').value.trim();
    const password = document.getElementById('passwordRegistro').value.trim();

    if (nombre && password) {
        if (usuarios.some(u => u.nombre === nombre)) {
            Swal.fire('Error', 'El usuario ya existe', 'error');
        } else {
            usuarios.push({ nombre, password });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            Swal.fire('Éxito', 'Usuario registrado correctamente', 'success').then(() => {
                mostrarLogin(); // Volver al login después del registro
            });
        }
    } else {
        Swal.fire('Error', 'Por favor complete todos los campos', 'error');
    }
});

// Función para iniciar sesión
document.getElementById('btnLogin').addEventListener('click', () => {
    const nombre = document.getElementById('nombreLogin').value.trim();
    const password = document.getElementById('passwordLogin').value.trim();

    const usuario = usuarios.find(u => u.nombre === nombre && u.password === password);

    if (usuario) {
        Swal.fire('Éxito', 'Inicio de sesión exitoso', 'success').then(() => {
            mostrarProductos();
        });
    } else {
        Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
    }
});

// Lista de productos
const productos = [
    { id: 1, nombre: "Escritorio", precio: 10000, imagen: "./img/escritorio.jpg" },
    { id: 2, nombre: "Laptop", precio: 350000, imagen: "./img/laptop.jpg" },
    { id: 3, nombre: "Monitor", precio: 150000, imagen: "./img/monitor.jpg" },
    { id: 4, nombre: "Mouse", precio: 10000, imagen: "./img/mouse.jpg" },
    { id: 5, nombre: "Silla", precio: 250000, imagen: "./img/silla.jpg" },
    { id: 6, nombre: "Teclado", precio: 250000, imagen: "./img/teclado.jpg" }
];

const carrito = [];

// Función para mostrar los productos
function mostrarProductos() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('productos').style.display = 'block';
    document.getElementById('iconoCarrito').style.display = 'inline-block';

    const contenedorProductos = document.getElementById('productos');
    contenedorProductos.innerHTML = '';

    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100px; height: auto;">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        contenedorProductos.appendChild(card);
    });
}

// Función para agregar productos al carrito
function agregarAlCarrito(productId) {
    carrito.push({ id: productId, cantidad: 1 });
    actualizarCarrito();
}

// Función para actualizar el carrito
function actualizarCarrito() {
    const cantidadProductos = document.getElementById('cantidadProductos');
    cantidadProductos.textContent = carrito.length;

    const listaCarrito = document.getElementById('listaCarrito');
    listaCarrito.innerHTML = '';

    let total = 0;
    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        total += producto.precio * item.cantidad;

        const li = document.createElement('li');
        li.innerHTML = `
            ${producto.nombre} - Precio: $${producto.precio} - Cantidad: ${item.cantidad}
            <button onclick="cambiarCantidad(${producto.id}, 1)">+</button>
            <button onclick="cambiarCantidad(${producto.id}, -1)">-</button>
        `;
        listaCarrito.appendChild(li);
    });

    document.getElementById('totalCarrito').textContent = total;
}

// Función para cambiar la cantidad de productos en el carrito
function cambiarCantidad(productId, cambio) {
    const item = carrito.find(i => i.id === productId);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            carrito.splice(carrito.indexOf(item), 1);
        }
    }
    actualizarCarrito();
}

// Función para mostrar el modal del carrito
function mostrarModal() {
    const modal = document.getElementById('modalCarrito');
    modal.classList.remove('oculto');
}

// Función para cerrar el modal del carrito
function cerrarModal() {
    const modal = document.getElementById('modalCarrito');
    modal.classList.add('oculto');
}

// Función para cerrar el modal de pago
function cerrarModalPago() {
    const modal = document.getElementById('modalPago');
    modal.classList.add('oculto');
}

// Evento para abrir el modal de pago
document.getElementById('btnPagar').addEventListener('click', () => {
    const modal = document.getElementById('modalPago');
    modal.classList.remove('oculto');
});

// Evento para confirmar el pago
document.getElementById('btnConfirmarPago').addEventListener('click', () => {
    const metodoPago = document.querySelector('input[name="pago"]:checked').value;
    if (metodoPago === 'tarjeta') {
        const numeroTarjeta = document.getElementById('numeroTarjeta').value;
        const nombreTitular = document.getElementById('nombreTitular').value;

        if (!numeroTarjeta || !nombreTitular) {
            Swal.fire('Error', 'Por favor complete todos los campos de tarjeta', 'error');
            return;
        }
    }

    Swal.fire('Éxito', 'Pago realizado con éxito', 'success').then(() => {
        carrito.length = 0; // Vaciar carrito
        actualizarCarrito(); // Actualizar visualización del carrito
        cerrarModalPago(); // Cerrar modal de pago
        mostrarProductos(); // Regresar a la vista de productos
    });
});
