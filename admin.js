// Utilisation directe de votre tableau productsData
let products = [...productsData];
let currentEditId = null;

// Afficher les produits
function displayProducts() {
    const tableBody = document.getElementById('productTable');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.title}" width="50"></td>
            <td>
                <strong>${product.title}</strong><br>
                <small>${product.category} • ${'★'.repeat(product.rating)}${'☆'.repeat(5-product.rating)}</small>
            </td>
            <td>${product.price}</td>
            <td class="actions">
                <button onclick="editProduct(${product.id})" class="edit-btn">✏️</button>
                <button onclick="deleteProduct(${product.id})" class="delete-btn">🗑️</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Ajouter/modifier un produit
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: currentEditId || Date.now(),
        title: document.getElementById('productTitle').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        price: document.getElementById('productPrice').value + 'DH',
        rating: parseInt(document.getElementById('productRating').value),
        image: document.getElementById('productImage').files[0]?.name || 'default.jpg'
    };

    if (currentEditId) {
        // Modification
        const index = products.findIndex(p => p.id === currentEditId);
        products[index] = formData;
    } else {
        // Ajout
        products.push(formData);
    }

    resetForm();
    displayProducts();
});

// Éditer un produit
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('productTitle').value = product.title;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = parseInt(product.price);
    document.getElementById('productRating').value = product.rating;
    document.getElementById('submitBtn').textContent = 'Modifier';
    currentEditId = id;
};

// Supprimer un produit
window.deleteProduct = function(id) {
    if (confirm('Supprimer ce produit ?')) {
        products = products.filter(p => p.id !== id);
        displayProducts();
        if (currentEditId === id) resetForm();
    }
};

// Réinitialiser le formulaire
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('submitBtn').textContent = 'Ajouter';
    currentEditId = null;
}

// Initialisation
displayProducts();

// Vérification de l'authentification
document.addEventListener('DOMContentLoaded', function() {
    if(!localStorage.getItem('adminAuthenticated')) {
        window.location.href = "login.html";
    }
    
    // Gestion de la déconnexion
    document.querySelector('.logout-btn').addEventListener('click', function() {
        localStorage.removeItem('adminAuthenticated');
        window.location.href = "login.html";
    });
});