// Registration Page Logic with Simple JWT Authentication
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const accountTypeToggle = document.getElementById('accountTypeToggle');
    const toggleOptions = accountTypeToggle.querySelectorAll('.toggle-option');
    const ongFields = document.getElementById('ongFields');
    const nameLabel = document.getElementById('nameLabel');
    
    let accountType = 'user'; // Default: adotante

    // Check if already authenticated
    if (authService.isAuthenticated()) {
        authService.redirectToDashboard();
        return;
    }

    // Toggle between User and ONG
    toggleOptions.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.type;
            
            // Update active state
            toggleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Update UI based on account type
            if (type === 'ong') {
                accountTypeToggle.classList.add('ong');
                ongFields.classList.add('active');
                nameLabel.textContent = 'Nome da ONG';
                document.getElementById('name').placeholder = 'Nome da sua ONG';
            } else {
                accountTypeToggle.classList.remove('ong');
                ongFields.classList.remove('active');
                nameLabel.textContent = 'Nome Completo';
                document.getElementById('name').placeholder = 'Seu nome completo';
            }
            
            accountType = type;
        });
    });

    // Phone mask (Brazilian format)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d*)/, '($1');
        }
        
        e.target.value = value;
    });

    // CEP mask (Brazilian postal code)
    const zipCodeInput = document.getElementById('zipCode');
    zipCodeInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d{0,3}).*/, '$1-$2');
        }
        
        e.target.value = value;
    });

    // Form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form data
        const formData = getFormData();
        
        // Set loading state
        setLoading(true);
        
        try {
            // Prepare user data
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                terms: formData.terms
            };

            // Add ONG-specific fields
            if (accountType === 'ong') {
                userData.phone = formData.phone.replace(/\D/g, '');
                userData.address = {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode.replace(/\D/g, '')
                };
            }
            
            // Register user with authentication service
            const response = await authService.register(userData, accountType);
            
            if (response.success) {
                // Show success message
                showAlert('Conta criada com sucesso! Redirecionando...', 'success');
                
                // Redirect to appropriate dashboard after 1.5 seconds
                setTimeout(() => {
                    authService.redirectToDashboard();
                }, 1500);
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert(error.message || 'Erro ao criar conta. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    });

    // Get form data
    function getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            phone: document.getElementById('phone').value.trim(),
            street: document.getElementById('street').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value.trim(),
            terms: document.getElementById('terms').checked
        };
    }

    // Clear all errors
    function clearErrors() {
        const inputs = registerForm.querySelectorAll('.form-input');
        const errors = registerForm.querySelectorAll('.form-error');
        
        inputs.forEach(input => input.classList.remove('error'));
        errors.forEach(error => {
            error.classList.add('hidden');
            error.textContent = '';
        });
        
        // Clear alert
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = '';
    }

    // Show alert message
    function showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alert-container');
        const alertHTML = `
            <div class="alert alert-${type}">
                ${getAlertIcon(type)}
                <span>${message}</span>
            </div>
        `;
        alertContainer.innerHTML = alertHTML;
        
        // Scroll to top to show alert
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Get alert icon based on type
    function getAlertIcon(type) {
        const icons = {
            success: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
            error: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
            warning: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
            info: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
        };
        return icons[type] || icons.info;
    }

    // Set loading state
    function setLoading(loading) {
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            submitBtn.textContent = '';
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.textContent = 'Criar Conta';
        }
    }
});




// API 

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

// Create singleton instance
const authService = new AuthService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = authService;
}