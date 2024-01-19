let cartItems = [];

document.addEventListener("DOMContentLoaded", function () {
    const cartList = document.getElementById("cartList");

    // Recuperar la lista de productos en el carrito desde la sesión del usuario
    cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

    // Verificar si hay productos en el carrito
    if (cartItems.length === 0) {
        cartList.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
        // Generar tarjetas dinámicamente
        cartItems.forEach(cartItem => {
            const cartItemElement = createCartItemElement(cartItem);
            cartList.appendChild(cartItemElement);
        });

        // Calcula y muestra el total del pedido
        updateTotalAndOrderTotal(cartItems);

        // Agregar la sección de total y checkout si aún no existe
        if (!document.getElementById("checkoutSection")) {
            addTotalAndCheckoutSection(cartItems);
        }
    }

    // Agregar el evento unload para vaciar el carrito antes de navegar hacia atrás
    window.addEventListener('unload', function () {
        // Limpiar el carrito antes de salir de la página
        sessionStorage.clear();
    });
});

function createCartItemElement(cartItem) {
    const cartItemElement = document.createElement("div");
    cartItemElement.className = "card custom-card";
    cartItemElement.style.display = "flex";
    cartItemElement.style.width = "575px"; // Ancho ajustado
    cartItemElement.style.margin = "10px"; // Márgenes

    const image = document.createElement("img");
    image.src = cartItem.image;
    image.className = "card-img-top";
    image.alt = "Product Image";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-row justify-content-between align-items-center";
    cardBody.style.margin = "5px";

    const cartItemInfo = document.createElement("div");
    cartItemInfo.className = "d-flex flex-column align-items-start";

    const cartItemName = document.createElement("h6");
    cartItemName.className = "card-title";
    cartItemName.textContent = cartItem.title;

    const quantityLabel = document.createElement("small");
    quantityLabel.textContent = "Cantidad";
    quantityLabel.style.margin = "5px";

    // Input para la cantidad
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = cartItem.quantity || 1; // Inicializado en 1 si no hay cantidad
    quantityInput.className = "form-control mb-2"; // Clase Bootstrap para darle estilo
    quantityInput.style.margin = "5px";
    quantityInput.addEventListener("change", function () {
        // Lógica para manejar el cambio en la cantidad
        updateCartItemQuantity(cartItem.id, parseInt(quantityInput.value, 10));
    });

    const cartItemPrice = document.createElement("p");
    cartItemPrice.className = "card-text";
    cartItemPrice.textContent = "$" + cartItem.price.toFixed(2);
    cartItemPrice.style.margin = "20px";

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-danger";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function () {
        // Lógica para manejar la solicitud DELETE al carrito
        removeCartItem(cartItem.id);
        // Elimina solo el elemento actual del DOM
        cartList.removeChild(cartItemElement);
        // Actualiza el total después de la eliminación
        updateTotalAndOrderTotal(cartItems);
    });

    // Añadir márgenes y espacio entre elementos
    cartItemInfo.style.marginRight = "10px";
    quantityLabel.style.marginBottom = "5px";
    quantityInput.style.marginBottom = "10px";

    cartItemInfo.appendChild(cartItemName);
    cartItemInfo.appendChild(quantityLabel);
    cartItemInfo.appendChild(quantityInput);

    cardBody.appendChild(image);
    cardBody.appendChild(cartItemInfo);
    cardBody.appendChild(cartItemPrice);
    cardBody.appendChild(removeButton);

    cartItemElement.appendChild(cardBody);

    // Almacena el input de cantidad en el objeto del carrito para futuras referencias
    cartItem.quantityInput = quantityInput;

    return cartItemElement;
}

function removeCartItem(itemId) {
    // Obtener la lista actual de productos en el carrito desde la sesión del usuario
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

    // Encontrar el índice del producto en el carrito basado en el itemId
    const indexToRemove = cartItems.findIndex(item => item.id === itemId);

    // Verificar si se encontró el índice
    if (indexToRemove !== -1) {
        // Eliminar el elemento del array
        cartItems.splice(indexToRemove, 1);

        // Guardar la lista actualizada en la sesión del usuario
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Actualizar la vista del carrito después de eliminar un elemento
        updateCartView(cartItems);
    } else {
        console.error('No se encontró el elemento en el carrito.');
    }
}

function updateCartItemQuantity(itemId, newQuantity) {
    // Obtener la lista actual de productos en el carrito desde la sesión del usuario
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

    // Encontrar el índice del producto en el carrito basado en el itemId
    const indexToUpdate = cartItems.findIndex(item => item.id === itemId);

    // Verificar si se encontró el índice
    if (indexToUpdate !== -1) {
        // Actualizar la cantidad del producto
        cartItems[indexToUpdate].quantity = newQuantity;

        // Guardar la lista actualizada en la sesión del usuario
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Actualizar la vista del carrito después de cambiar la cantidad
        updateCartView(cartItems);

        // Actualizar el total después de cambiar la cantidad
        updateTotalAndOrderTotal(cartItems);
    } else {
        console.error('No se encontró el elemento en el carrito.');
    }
}

function updateCartView(cartItems) {
    const cartList = document.getElementById("cartList");

    // Limpiar la lista
    cartList.innerHTML = "";

    // Verificar si hay productos restantes en el carrito
    if (cartItems.length === 0) {
        cartList.innerHTML = "<p>El carrito está vacío.</p>";
        updateTotalAndOrderTotal(cartItems);
    } else {
        // Generar dinámicamente las tarjetas para los productos restantes
        cartItems.forEach(cartItem => {
            const cartItemElement = createCartItemElement(cartItem);
            cartList.appendChild(cartItemElement);
        });

        // Calcula y muestra el total del pedido después de la eliminación
        updateTotalAndOrderTotal(cartItems);
    }
}

function updateTotalAndOrderTotal(cartItems) {
    const totalAmount = cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

    // Actualizar el total en la sección de checkout
    document.getElementById("checkoutTotal").textContent = "$" + totalAmount.toFixed(2);
}

function addTotalAndCheckoutSection(cartItems) {
    const checkoutSection = document.createElement("div");
    checkoutSection.id = "checkoutSection";
    checkoutSection.className = "card custom-card";
    checkoutSection.style.width = "575px"; // Ancho ajustado
    checkoutSection.style.margin = "10px"; // Márgenes
    checkoutSection.style.padding = "10px"; // Añadir espacio interno

    const totalLabel = document.createElement("h6");
    totalLabel.textContent = "Total";

    const orderTotal = document.createElement("p");
    orderTotal.id = "checkoutTotal"; // Cambié el ID para evitar duplicados
    orderTotal.textContent = "$0.00";

    const checkoutButton = document.createElement("button");
    checkoutButton.className = "btn btn-success";
    checkoutButton.textContent = "Checkout";

    // Asegúrate de que cartItems esté disponible en el ámbito del evento de clic
    checkoutButton.addEventListener("click", function () {
        // Lógica para el proceso de pago y creación de la orden
        console.log('Haciendo clic en Checkout. cartItems:', cartItems);
        createOrder(cartItems);
    });

    checkoutSection.appendChild(totalLabel);
    checkoutSection.appendChild(orderTotal);
    checkoutSection.appendChild(checkoutButton);

    // Agregar la sección de checkout al contenedor principal
    document.getElementById("cardContainer").appendChild(checkoutSection);
}

async function createOrder() {
    // Obtener la fecha actual
    console.log("Hay items?", cartItems);
    const currentDate = new Date().toISOString();

    // Obtener el total del carrito
    const totalAmount = parseFloat(document.getElementById("checkoutTotal").textContent.replace("$", ""));

    const orderDetails = Array.isArray(cartItems) ? cartItems.map(item => ({
        id: 0,
        IDOrden: 0,
        IDProducto: item.id,
        Cantidad: item.quantity || 1, // Asegúrate de que haya una cantidad predeterminada si no está definida
        Precio: item.price,
    })) : [];

    // Crear el objeto de datos para enviar en la solicitud
    const orderData = {
        IDOrden: 0,
        Fecha: currentDate,
        Total: totalAmount,
        Detalle: orderDetails
    };

    // Mostrar el JSON que se está enviando en la consola
    console.log('JSON enviado en la solicitud:', JSON.stringify(orderData));
    console.log('JSON enviado en la solicitud:', orderData);

    // Realizar el primer fetch para crear la orden
    try {
        let response = await fetch('https://localhost:7280/api/Orden', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (response.ok) {
            //borrar carrito
            sessionStorage.removeItem("cartItems");
            updateCartView([]);

            console.log('Orden creada con éxito:', response.json());
            alert('¡Gracias por tu compra! Orden creada con éxito.');
        } else {
            alert("Algo salio mal, intenta de nuevo");
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}
