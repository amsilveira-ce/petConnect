// Login Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const accountTypeToggle = document.getElementById('accountTypeToggle');
    const toggleOptions = accountTypeToggle.querySelectorAll('.toggle-option');
    
    let accountType = 'user';

    // Toggle between User and ONG
     toggleOptions.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.type;

            // Atualiza visual ativo
            toggleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Move o slider
            if (type === 'ong') {
                accountTypeToggle.classList.add('ong');
            } else {
                accountTypeToggle.classList.remove('ong');
            }

            // Anima o clique
            toggleSlider.classList.add('clicked');
            setTimeout(() => toggleSlider.classList.remove('clicked'), 150);

            accountType = type;
        });
    });
    accountTypeToggle.addEventListener('click', (e) => {
        if (!e.target.classList.contains('toggle-option')) {
            const current = accountType === 'user' ? 'ong' : 'user';
            const option = accountTypeToggle.querySelector(`[data-type="${current}"]`);
            option.click();
        }
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form data
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!validateForm(email, password)) {
            return;
        }
        
        // Set loading state
        setLoading(true);
        
        try {
            // Call login API
            const response = await api.login({
                email,
                password
            });
            
            if (response.success) {
                // Store user info in localStorage
                const userInfo = {
                    role: response.role,
                    email: email,
                    name: response.account.name
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                
                // Show success message
                showAlert('Login realizado com sucesso!', 'success');
                
                // Redirect based on role
                setTimeout(() => {
                    if (response.role === 'ong') {
                        window.location.href = 'ong-dashboard.html';
                    } else {
                        window.location.href = 'user-dashboard.html';
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert(error.message || 'Erro ao fazer login. Verifique suas credenciais.', 'error');
        } finally {
            setLoading(false);
        }
    });

    // Validation function
    function validateForm(email, password) {
        let isValid = true;
        
        // Email validation
        if (!email) {
            showFieldError('email', 'O e-mail é obrigatório');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Digite um e-mail válido');
            isValid = false;
        }
        
        // Password validation
        if (!password) {
            showFieldError('password', 'A senha é obrigatória');
            isValid = false;
        } else if (password.length < 8) {
            showFieldError('password', 'A senha deve ter pelo menos 8 caracteres');
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
        
        input.classList.add('error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    // Clear all errors
    function clearErrors() {
        const inputs = loginForm.querySelectorAll('.form-input');
        const errors = loginForm.querySelectorAll('.form-error');
        
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
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
        }
    }

    // Check if already logged in
    checkAuthStatus();

    async function checkAuthStatus() {
        try {
            const response = await api.checkAuth();
            if (response.success) {
                // User is already logged in, redirect
                if (response.role === 'ong') {
                    window.location.href = 'ong-dashboard.html';
                } else {
                    window.location.href = 'user-dashboard.html';
                }
            }
        } catch (error) {
            // User is not logged in, do nothing
        }
    }
});