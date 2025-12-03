import { authService } from './api.js';

// ============================
// DASHBOARD PROTECTION
// ============================

// Verifica se o usuário está autenticado
if (!authService.isAuthenticated()) {
    console.warn('Usuário não autenticado. Redirecionando para login...');
    window.location.href = 'login.html';
} else {
    console.log('Usuário autenticado:', authService.getUserData());
}

// Garante que o tipo do usuário está correto
const userType = authService.getUserType();

if (!userType) {
    console.warn('Tipo de usuário não encontrado. Redirecionando para login.');
    authService.logout();
}

// Proteção específica por dashboard:
const currentPage = window.location.pathname;

// Se o usuário for uma ONG, ele não pode acessar o dashboard do adotante
if (userType === 'ong' && currentPage.includes('user-dashboard')) {
    console.warn('ONG tentando acessar dashboard de usuário. Redirecionando...');
    authService.redirectToDashboard();
}

// Se o usuário for um adotante, ele não pode acessar o dashboard da ONG
if (userType === 'user' && currentPage.includes('ong-dashboard')) {
    console.warn('Usuário tentando acessar dashboard da ONG. Redirecionando...');
    authService.redirectToDashboard();
}

// Logs úteis (podem ser removidos depois)
console.log('Dashboard validated for user type:', userType);
