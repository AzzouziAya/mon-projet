document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
    const loginForm = document.getElementById('loginForm');

    // Basculer entre login/register
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });

    // Gestion de la connexion
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = this.querySelector('input[type="text"]').value;
            const password = this.querySelector('input[type="password"]').value;

            // TEST : Ces identifiants fonctionneront pour le démo
            if(username === "admin" && password === "admin123") {
                localStorage.setItem('adminAuthenticated', 'true');
                window.location.href = "admin.html";
            } else {
                // Animation d'erreur
                this.classList.add('shake');
                setTimeout(() => {
                    this.classList.remove('shake');
                }, 500);
                alert("Identifiants incorrects. Utilisez admin/admin123 pour tester");
            }
        });
    }
});