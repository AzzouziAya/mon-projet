document.addEventListener('DOMContentLoaded', function() {
    // 1. Vérification d'authentification
    if(!localStorage.getItem('adminAuthenticated')) {
        window.location.href = "login.html";
        return;
    }

    // 🛠️ 2. INITIALISATION CORRIGÉE : Utilise productManager
    let products = window.productManager.getProducts(); // ← Modifié
    let currentEditId = null;

    // 3. Fonction d'affichage (inchangée)
    function displayProducts() {
        const tableBody = document.getElementById('productTable');
        if (!tableBody) {
            console.error("Erreur: Table body introuvable");
            return;
        }

        tableBody.innerHTML = products.map(product => `
            <tr>
                <td><img src="${product.image}" alt="${product.title}" width="50"></td>
                <td>
                    <strong>${product.title}</strong><br>
                    <small>${product.category} • ${'★'.repeat(parseInt(product.rating))}${'☆'.repeat(5-parseInt(product.rating))}</small>
                </td>
                <td>${product.price}</td>
                <td class="actions">
                    <button data-id="${product.id}" class="edit-btn">✏️</button>
                    <button data-id="${product.id}" class="delete-btn">🗑️</button>
                </td>
            </tr>
        `).join('');

        // Gestion des boutons (inchangée)
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editProduct(parseInt(btn.dataset.id)));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteProduct(parseInt(btn.dataset.id)));
        });
    }

    // 🛠️ 4. GESTION DU FORMULAIRE CORRIGÉE
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            id: currentEditId || Date.now(),
            title: this.elements['productTitle'].value,
            description: this.elements['productDescription'].value,
            category: this.elements['productCategory'].value,
            price: this.elements['productPrice'].value + 'DH',
            rating: parseInt(this.elements['productRating'].value),
            image: this.elements['productImage'].files[0]?.name || 'default.jpg'
        };

        if (currentEditId) {
            // Modification
            const index = products.findIndex(p => p.id === currentEditId);
            if (index !== -1) products[index] = formData;
        } else {
            // Ajout
            products.push(formData);
        }

        // 🛠️ SAUVEGARDE OBLIGATOIRE avant redirection
        window.productManager.saveProducts(products); // ← Ajouté
        resetForm();
        displayProducts();

        // Redirection après 500ms (peut être réduit ou supprimé)
        setTimeout(() => {
            window.location.href = "web.html";
        }, 500);
    });

    // 5. FONCTIONS UTILITAIRES (inchangées sauf deleteProduct)
    function editProduct(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const form = document.getElementById('productForm');
        form.elements['productTitle'].value = product.title;
        form.elements['productDescription'].value = product.description;
        form.elements['productCategory'].value = product.category;
        form.elements['productPrice'].value = parseInt(product.price);
        form.elements['productRating'].value = product.rating;
        form.elements['submitBtn'].textContent = 'Modifier';
        currentEditId = id;
    }

    function deleteProduct(id) {
        if (confirm('Supprimer ce produit ?')) {
            products = products.filter(p => p.id !== id);
            window.productManager.saveProducts(products); // ← Déjà corrigé
            displayProducts();
            if (currentEditId === id) resetForm();
        }
    }

    function resetForm() {
        document.getElementById('productForm').reset();
        document.getElementById('submitBtn').textContent = 'Ajouter';
        currentEditId = null;
    }

    // 6. Gestion de la déconnexion (inchangée)
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminAuthenticated');
            window.location.href = "login.html";
        });
    }

    // 7. Initialisation finale
    displayProducts();
    console.log("Admin panel initialisé avec", products.length, "produits");
});
