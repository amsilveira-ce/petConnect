import { authService } from './api.js';

// Registration Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const accountTypeToggle = document.getElementById('accountTypeToggle');
    const toggleOptions = accountTypeToggle.querySelectorAll('.toggle-option');
    const ongFields = document.getElementById('ongFields');
    const nameLabel = document.getElementById('nameLabel');
    
    let accountType = 'user';

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
            
            // Update toggle slider position
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

    // Mascara do telefone (formato brasileiro)
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

    // CEP
    const zipCodeInput = document.getElementById('zipCode');
    zipCodeInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d{0,3}).*/, '$1-$2');
        }
        
        e.target.value = value;
    });

    // Formulário de submissão
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form data
        const formData = getFormData();
        
        // Validate form
        if (!validateForm(formData)) {
            return;
        }
        
        // Set loading state
        setLoading(true);
        
        try {
            // Prepare data for API
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                terms: formData.terms
            };

            // Add ONG-specific fields
            if (accountType === 'ong') {
                if (!formData.phone || !formData.street || !formData.city || !formData.state || !formData.zipCode) {
                    showAlert('Por favor, preencha todos os campos obrigatórios para ONGs', 'error');
                    setLoading(false);
                    return;
                }

                userData.phone = formData.phone.replace(/\D/g, '');
                userData.address = {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode.replace(/\D/g, '')
                };
            }
            
            
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

    // Validation function
    function validateForm(data) {
        let isValid = true;
        
        // Name validation
        if (!data.name || data.name.length < 2) {
            showFieldError('name', 'Digite um nome válido (mínimo 2 caracteres)');
            isValid = false;
        }
        
        // Email validation
        if (!data.email) {
            showFieldError('email', 'O e-mail é obrigatório');
            isValid = false;
        } else if (!isValidEmail(data.email)) {
            showFieldError('email', 'Digite um e-mail válido');
            isValid = false;
        }
        
        // Password validation
        if (!data.password) {
            showFieldError('password', 'A senha é obrigatória');
            isValid = false;
        } else if (data.password.length < 8) {
            showFieldError('password', 'A senha deve ter pelo menos 8 caracteres');
            isValid = false;
        }
        
        // Confirm password validation
        if (data.password !== data.confirmPassword) {
            showFieldError('confirmPassword', 'As senhas não coincidem');
            isValid = false;
        }
        
        // ONG-specific validation
        if (accountType === 'ong') {
            if (!data.phone) {
                showFieldError('phone', 'O telefone é obrigatório para ONGs');
                isValid = false;
            }
            
            if (!data.street || !data.city || !data.state || !data.zipCode) {
                showAlert('Por favor, preencha o endereço completo', 'error');
                isValid = false;
            }
        }
        
        // Terms validation
        if (!data.terms) {
            showFieldError('terms', 'Você deve aceitar os termos para continuar');
            isValid = false;
        }
        
        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Show field-specific error
    function showFieldError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorDiv = document.getElementById(`${fieldId}Error`);
        
        if (input && errorDiv) {
            input.classList.add('error');
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
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