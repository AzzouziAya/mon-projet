// shop.js (AJOUTE au début)
function refreshProducts() {
    const products = window.productManager.getProducts();
    // Ton code d'affichage existant (displayProducts) ici
}

// Écouteurs pour mettre à jour automatiquement
window.addEventListener('productsUpdated', refreshProducts);
document.addEventListener('DOMContentLoaded', refreshProducts);
// Utilisez getProducts() au lieu de productsData directement
let productsData = JSON.parse(localStorage.getItem('products')) || [];
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        productsData = JSON.parse(storedProducts);
        displayProducts(productsData);
    }
}
function refreshProducts() {
    const freshData = JSON.parse(localStorage.getItem('products')) || [];
    productsData = freshData;
    displayProducts(freshData);
}

// Écouteurs d'événements
window.addEventListener('storage', () => refreshProducts());
window.addEventListener('productsUpdated', () => refreshProducts());

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', refreshProducts);

// Au chargement ET quand les produits changent
document.addEventListener('DOMContentLoaded', loadProducts);
window.addEventListener('storage', loadProducts);
window.addEventListener('productsUpdated', (e) => {
    productsData = e.detail.products;
    displayProducts(productsData);
});
window.addEventListener('productsUpdated', (e) => {
    window.productsData = e.detail.products;
    displayProducts(window.productsData);
  });
function displayProducts(productsToShow) {
    const container = document.querySelector('.pro-container');
    container.innerHTML = '';
    
    productsToShow.forEach(product => {
        container.innerHTML += `
        <div class="pro" data-category="${product.category}">
            <img src="${product.image}" alt="${product.title}"/>
            <button class="info-btn">i</button> <!-- Nouveau bouton info -->
            <div class="post-it-bubble hidden"> <!-- Nouvelle bulle -->
                <div class="pin"></div>
                <p>${product.description}</p>
            </div>
            <div class="des">
                <span>${product.category}</span>
                <h5>${product.title}</h5>
                <div class="star">
                    ${'<i class="fa-solid fa-star"></i>'.repeat(parseInt(product.rating))}
                </div>
                <h4>${product.price}</h4>
            </div>
            <button class="addCart">Add To Cart</button>
        </div>
        `;
    });
}

// Initialisation - Affiche tous les produits au chargement
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(window.productsData || []);
  
    
    // Gestion des filtres
    const buttons = document.querySelectorAll(".buttons button");
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const category = this.textContent.toLowerCase();
            
            // Mettre à jour le bouton actif
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            
            // Filtrer les produits
            const filteredProducts = category === "all" 
                ? productsData 
                : productsData.filter(p => p.category === category);
            
            displayProducts(filteredProducts);
        });
    });
    
    // Gestion de la recherche
    const searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        const filteredProducts = productsData.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments
    const previewContainer = document.querySelector('.products-preview');
    const previewBox = previewContainer.querySelector('.preview');
    const productBoxes = document.querySelectorAll('.pro-container .pro');
    const closePreview = previewBox.querySelector('.fa-times');

    // Fonction pour ouvrir la prévisualisation
    productBoxes.forEach(product => {
        product.addEventListener('click', function() {
            // Récupérer les données du produit
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('h5').textContent;
            const price = this.querySelector('h4').textContent;
            const stars = this.querySelectorAll('.star i').length;
            const category = this.querySelector('span').textContent;

            // Mettre à jour la prévisualisation avec les données du produit
            previewBox.querySelector('img').src = imgSrc;
            previewBox.querySelector('h3').textContent = title;
            previewBox.querySelector('.price').textContent = price;
            
            // Mettre à jour les étoiles
            const starsContainer = previewBox.querySelector('.stars');
            starsContainer.innerHTML = '';
            for (let i = 0; i < stars; i++) {
                starsContainer.innerHTML += '<i class="fas fa-star"></i>';
            }
            
            // Afficher la prévisualisation
            previewContainer.style.display = 'flex';
            previewBox.classList.add('active');
        });
    });

    // Fermer la prévisualisation
    closePreview.addEventListener('click', function() {
        previewContainer.style.display = 'none';
        previewBox.classList.remove('active');
    });

    // Fermer en cliquant en dehors de la prévisualisation
    previewContainer.addEventListener('click', function(e) {
        if (e.target === previewContainer) {
            previewContainer.style.display = 'none';
            previewBox.classList.remove('active');
        }
    });
});
let iconCart = document.querySelector(".lg-bag");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");
let listProductHTML = document.querySelector(".pro-container")

iconCart.addEventListener("click", () =>{
    body.classList.toggle("showCart")
})
closeCart.addEventListener("click", () => {
    body.classList.toggle("showCart")
})

// ==================== GESTION DU PANIER ====================


// Variables globales pour le panier
let cart = [];
let cartCount = 0;

// Fonction pour ajouter un produit au panier
function addToCart(product) {
    const existingItem = cart.find(item => item.title === product.title);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }
    
    cartCount++;
    updateCart();
}

// Mettre à jour l'affichage du panier
function updateCart() {
    const listCart = document.querySelector('.listCart');
    const cartTotalElement = document.querySelector('.cart-total span');
    const cartCountElement = document.querySelector('.cart-count');
    
    listCart.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = parseInt(item.price) * item.quantity;
        total += itemTotal;
        
        listCart.innerHTML += `
        <div class="item">
            <img src="${item.image}" alt="${item.title}">
            <div class="info">
                <div class="name">${item.title}</div>
                <div class="category">${item.category}</div>
                <div class="price">${item.price}</div>
            </div>
            <div class="quantity">
                <button class="minus">-</button>
                <span>${item.quantity}</span>
                <button class="plus">+</button>
            </div>
            <div class="total">${itemTotal}DH</div>
        </div>`;
    });
    
    cartTotalElement.textContent = `${total}DH`;
    cartCountElement.textContent = cartCount;
}

// Gestion des événements
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.remove('showCart');
    // Ajout au panier
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('addCart')) {
            const productElement = e.target.closest('.pro');
            const product = {
                title: productElement.querySelector('h5').textContent,
                price: productElement.querySelector('h4').textContent,
                image: productElement.querySelector('img').src,
                category: productElement.querySelector('span').textContent
            };
            addToCart(product);
            
            // Animation de feedback
            e.target.textContent = 'Ajouté !';
            setTimeout(() => {
                e.target.textContent = 'Add To Cart';
            }, 1000);
        }
        
        // Gestion des quantités
        if (e.target.classList.contains('minus') || e.target.classList.contains('plus')) {
            const itemElement = e.target.closest('.item');
            const itemName = itemElement.querySelector('.name').textContent;
            const item = cart.find(i => i.title === itemName);
            
            if (e.target.classList.contains('minus')) {
                if (item.quantity > 1) {
                    item.quantity--;
                    cartCount--;
                } else {
                    cart = cart.filter(i => i.title !== itemName);
                    cartCount--;
                }
            } else {
                item.quantity++;
                cartCount++;
            }
            
            updateCart();
        }
    });
    
    // Ouverture/fermeture du panier
    document.querySelector('.lg-bag').addEventListener('click', () => {
        document.body.classList.toggle('showCart');
    });
    
    document.querySelector('.close').addEventListener('click', () => {
        document.body.classList.remove('showCart');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Gestion ouverture/fermeture panier
    document.querySelector('.lg-bag').addEventListener('click', function(e) {
      e.preventDefault();
      document.body.classList.toggle('showCart');
    });
  
    document.querySelector('.cartTab .close').addEventListener('click', function() {
      document.body.classList.remove('showCart');
    });
  });
 

// Gestion des bulles info
document.addEventListener('click', function(e) {
    // Ouverture bulle
    if (e.target.classList.contains('info-btn')) {
        e.stopPropagation();
        const bubble = e.target.nextElementSibling;
        document.querySelectorAll('.post-it-bubble').forEach(b => {
            if (b !== bubble) b.classList.add('hidden');
        });
        bubble.classList.toggle('hidden');
    }
    
    // Fermeture si clique ailleurs
    if (!e.target.closest('.post-it-bubble') && !e.target.classList.contains('info-btn')) {
        document.querySelectorAll('.post-it-bubble').forEach(b => {
            b.classList.add('hidden');
        });
    }
});
// Nouvelle fonction de filtrage par prix
function filterByPrice(products, priceRange) {
    if (priceRange === "all") return products;
    
    const [min, max] = priceRange.split('-').map(Number);
    
    return products.filter(product => {
        const price = parseInt(product.price);
        if (priceRange.endsWith('+')) return price > 85;
        return price >= min && price <= max;
    });
}


document.getElementById('priceFilter').addEventListener('change', function() {
    const category = document.querySelector('.buttons button.active').textContent.toLowerCase();
    const priceRange = this.value;
    
    let filteredProducts = category === "all" 
        ? productsData 
        : productsData.filter(p => p.category === category);
    
    filteredProducts = filterByPrice(filteredProducts, priceRange);
    displayProducts(filteredProducts);
});
