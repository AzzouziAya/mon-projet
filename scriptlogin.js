document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = this.querySelector('input[type="text"]').value;
        const password = this.querySelector('input[type="password"]').value;

        if (username === "admin" && password === "admin123") {
            // 1. Authentification
            localStorage.setItem('adminAuthenticated', 'true');
            
            // 2. Synchronisation des données
            if (!localStorage.getItem('products') || 
                JSON.parse(localStorage.getItem('products')).length === 0) {
                localStorage.setItem('products', JSON.stringify(window.productsData));
            }
            
            // 3. Redirection
            window.location.href = "admin.html";
        } else {
            alert("Identifiants incorrects");
        }
    });
});