document.addEventListener("DOMContentLoaded", function () {
    const cardContainer = document.getElementById("cardContainer");
    const categoryMenu = document.getElementById("categoryMenu");

    let allProducts = [];  // Variable para almacenar todos los productos
    let currentCategory = "all";  // Variable para almacenar la categoría actual

    // Verificar si hay una lista de carrito en la sesión del usuario
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

    // Realizar un fetch a la API solo si no hay productos en el carrito
    if (cartItems.length === 0) {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(products => {
                allProducts = products;  // Almacenar todos los productos
                // Generar tarjetas dinámicamente
                products.forEach(product => {
                    const card = createProductCard(product);
                    cardContainer.appendChild(card);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function createProductCard(product) {
        const card = document.createElement("div");
        card.className = "card custom-card";
        card.style.width = "250px";
        card.style.height = "420px";
        card.setAttribute('data-product-id', product.id); // Añadir atributo de datos

        const image = document.createElement("img");
        image.src = product.image;
        image.className = "card-img-top";
        image.alt = "Product Image";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const cardTitle = document.createElement("h6");
        cardTitle.className = "card-title";
        cardTitle.textContent = product.title;

        const cardPrice = document.createElement("p");
        cardPrice.className = "card-text";
        cardPrice.textContent = "$" + product.price.toFixed(2);

        const addToCartButton = document.createElement("button");
        addToCartButton.className = "btn btn-primary";
        addToCartButton.textContent = "Agregar al carrito";
        addToCartButton.addEventListener("click", function () {
            // Lógica para manejar la solicitud POST al carrito
            addToCart(product);
        });

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardPrice);
        cardBody.appendChild(addToCartButton);
        card.appendChild(image);
        card.appendChild(cardBody);

        return card;
    }

    function addToCart(product) {
        // Clonar el objeto product para evitar modificar el original
        const productToAdd = { ...product };

        // Verificar si el producto ya está en el carrito
        const existingItem = cartItems.find(item => item.id === productToAdd.id);

        if (existingItem) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            existingItem.quantity++;
        } else {
            // Si el producto no está en el carrito, agregarlo con cantidad 1
            productToAdd.quantity = 1;
            cartItems.push(productToAdd);
        }

        // Almacenar el array actualizado en la sesión del usuario
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Notificar al usuario usando Alertify
        alertify.success('Producto agregado al carrito con éxito');

        // Actualizar la tarjeta en la página principal para mostrar la cantidad
        updateProductCard(productToAdd.id);

        console.log('Producto agregado al carrito:', productToAdd);
    }

    function updateProductCard(productId) {
        // Encontrar la tarjeta del producto por su ID y actualizar la cantidad
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);

        if (productCard) {
            const addToCartButton = productCard.querySelector('.btn-primary');
            const product = cartItems.find(item => item.id === productId);

            // Actualizar el texto del botón con la cantidad actualizada
            addToCartButton.textContent = `Agregar al carrito (${product.quantity})`;
        }
    }

   
});
