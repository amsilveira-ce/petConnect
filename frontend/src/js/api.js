import { CONFIG } from './config.js';

// API Client for PetConnect Backend
const API_BASE_URL = 'http://localhost:5010/api';

class APIClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Helper method to make requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            credentials: 'include', // Important for cookies
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication endpoints
    async signup(userData) {
        return this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST',
        });
    }

    async verifyEmail(code) {
        return this.request('/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    }

    async forgotPassword(email) {
        return this.request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(token, newPassword) {
        return this.request(`/auth/reset-password/${token}`, {
            method: 'POST',
            body: JSON.stringify({ newPassword }),
        });
    }

    async checkAuth() {
        return this.request('/auth/check-auth');
    }

    // Pet endpoints
    async getPets(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/pets?${params}`);
    }

    async getPetById(id) {
        return this.request(`/pets/${id}`);
    }

    // User endpoints
    async toggleFavorite(petId) {
        return this.request(`/pets/favorite/${petId}`, {
            method: 'POST',
        });
    }

    // Application endpoints
    async submitApplication(applicationData) {
        return this.request('/applications', {
            method: 'POST',
            body: JSON.stringify(applicationData),
        });
    }

    async getUserApplications() {
        return this.request('/applications/my-applications');
    }
}


// Simple Authentication System for PetConnect
// This system stores JWT token from environment variables in sessionStorage

class AuthService {
    constructor() {
        this.TOKEN_KEY = 'petconnect_token';
        this.USER_TYPE_KEY = 'petconnect_user_type';
        this.USER_DATA_KEY = 'petconnect_user_data';
    }

    /**
     * Register a new user (adotante or ong)
     */
    async register(userData, userType) {
        try {
            // Simulate API delay
            await this.simulateDelay(500);

            // Validate user data
            this.validateUserData(userData, userType);

            // In a real application, this would make an API call to register the user
            // For this simple implementation, we're simulating success
            
            // Store JWT token from config (simulating .env)
            sessionStorage.setItem(this.TOKEN_KEY, CONFIG.JWT_TOKEN);
            
            // Store user type (user or ong)
            sessionStorage.setItem(this.USER_TYPE_KEY, userType);
            
            // Store user data (without password)
            const { password, confirmPassword, ...safeUserData } = userData;
            sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify({
                ...safeUserData,
                userType: userType,
                registeredAt: new Date().toISOString()
            }));

            return {
                success: true,
                message: 'Cadastro realizado com sucesso!',
                userType: userType
            };
        } catch (error) {
            throw new Error(error.message || 'Erro ao realizar cadastro');
        }
    }

    /**
     * Login user (adotante or ong)
     */
    async login(email, password, userType) {
        try {
            // Simulate API delay
            await this.simulateDelay(500);

            // Validate credentials
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            // In a real application, this would validate against a backend
            // For this simple implementation, we accept any valid email/password
            
            // Store JWT token from config (simulating .env)
            sessionStorage.setItem(this.TOKEN_KEY, CONFIG.JWT_TOKEN);
            
            // Store user type
            sessionStorage.setItem(this.USER_TYPE_KEY, userType);
            
            // Store mock user data
            sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify({
                email: email,
                userType: userType,
                name: userType === 'ong' ? 'ONG Exemplo' : 'Usuário Exemplo',
                loggedInAt: new Date().toISOString()
            }));

            return {
                success: true,
                message: 'Login realizado com sucesso!',
                userType: userType
            };
        } catch (error) {
            throw new Error(error.message || 'Erro ao fazer login');
        }
    }

    /**
     * Logout user
     */
    logout() {
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_TYPE_KEY);
        sessionStorage.removeItem(this.USER_DATA_KEY);
        window.location.href = 'index.html';
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const token = sessionStorage.getItem(this.TOKEN_KEY);
        return !!token;
    }

    /**
     * Get current user type
     */
    getUserType() {
        return sessionStorage.getItem(this.USER_TYPE_KEY);
    }

    /**
     * Get current user data
     */
    getUserData() {
        const data = sessionStorage.getItem(this.USER_DATA_KEY);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Get JWT token
     */
    getToken() {
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Redirect to appropriate dashboard based on user type
     */
    redirectToDashboard() {
        const userType = this.getUserType();
        
        if (userType === 'ong') {
            window.location.href = CONFIG.ONG_DASHBOARD;
        } else if (userType === 'user') {
            window.location.href = CONFIG.USER_DASHBOARD;
        } else {
            // Fallback to login if no user type found
            window.location.href = 'login.html';
        }
    }

    /**
     * Validate user data before registration
     */
    validateUserData(userData, userType) {
        // Name validation
        if (!userData.name || userData.name.length < 2) {
            throw new Error('Nome deve ter pelo menos 2 caracteres');
        }

        // Email validation
        if (!userData.email || !this.isValidEmail(userData.email)) {
            throw new Error('Email inválido');
        }

        // Password validation
        if (!userData.password || userData.password.length < 8) {
            throw new Error('Senha deve ter pelo menos 8 caracteres');
        }

        // Confirm password validation
        if (userData.password !== userData.confirmPassword) {
            throw new Error('As senhas não coincidem');
        }

        // ONG-specific validation
        if (userType === 'ong') {
            if (!userData.phone) {
                throw new Error('Telefone é obrigatório para ONGs');
            }
            if (!userData.address || !userData.address.street || !userData.address.city || 
                !userData.address.state || !userData.address.zipCode) {
                throw new Error('Endereço completo é obrigatório para ONGs');
            }
        }

        // Terms validation
        if (!userData.terms) {
            throw new Error('Você deve aceitar os termos para continuar');
        }

        return true;
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Simulate network delay
     */
    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create singleton instances and export using ESM
export const authService = new AuthService();
export const api = new APIClient();