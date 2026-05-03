const tabs = document.querySelectorAll('.bouton');
const forms = document.querySelectorAll('form');
const messageBox = document.getElementById('message');
const showField = document.getElementById('show-password');

function switchTab(tab) {
    tabs.forEach(button => button.classList.toggle('active', button.dataset.tab === tab));
    forms.forEach(form => form.classList.toggle('active', form.id === tab + '-form'));
    clearMessage();
}

function clearMessage() {
    messageBox.style.display = 'none';
    messageBox.textContent = '';
    messageBox.classList.remove('error');
}

function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.classList.toggle('error', isError);
    messageBox.style.display = 'block';
}

function getStoredAccount(shopName) {
    if (!shopName) return null;
    const stored = localStorage.getItem(`stockflow_account_${shopName}`);
    return stored ? JSON.parse(stored) : null;
}

function createAccount(event) {
    event.preventDefault();
    clearMessage();

    const shopName = document.getElementById('creation-shop').value.trim();
    const email = document.getElementById('creation-email').value.trim();
    const password = document.getElementById('creation-password').value;

    if (shopName.length < 2) {
        showMessage('Le nom de la boutique doit contenir au moins 2 caractères.', true);
        return;
    }

    if (!email.includes('@')) {
        showMessage('Veuillez saisir une adresse e-mail valide.', true);
        return;
    }

    if (password.length < 6) {
        showMessage('Le mot de passe doit contenir au moins 6 caractères.', true);
        return;
    }

    if (getStoredAccount(shopName)) {
        showMessage('Cette boutique existe déjà. Essayez de vous connecter.', true);
        switchTab('connexion');
        return;
    }

    const account = {
        shopName,
        email,
        password
    };

    localStorage.setItem(`stockflow_account_${shopName}`, JSON.stringify(account));
    localStorage.setItem('boutique', shopName);
    document.getElementById('creation-form').reset();
    window.location.href = 'accueil.html';
}

function login(event) {
    event.preventDefault();
    clearMessage();

    const shopName = document.getElementById('connexion-shop').value.trim();
    const password = document.getElementById('connexion-password').value;

    const account = getStoredAccount(shopName);
    if (!account) {
        showMessage('Boutique introuvable. Créez d’abord votre boutique.', true);
        switchTab('creation');
        return;
    }

    if (account.password !== password) {
        showMessage('Mot de passe incorrect. Réessayez.', true);
        return;
    }

    localStorage.setItem('boutique', account.shopName);
    document.getElementById('connexion-form').reset();
    window.location.href = 'accueil.html';
}

function togglePassword(event) {
    const field = document.querySelectorAll('input[type="password"]');
    field.forEach(input => {
        input.type = event.target.checked ? 'text' : 'password';
    });
}

switchTab('creation');

document.getElementById('creation-form').addEventListener('submit', createAccount);
document.getElementById('connexion-form').addEventListener('submit', login);
document.getElementById('show-password').addEventListener('change', togglePassword);
