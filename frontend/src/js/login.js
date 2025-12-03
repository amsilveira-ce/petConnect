import { authService } from "./api.js";

// Login Page Logic
document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const accountTypeToggle = document.getElementById('accountTypeToggle');
    const toggleButtons = accountTypeToggle.querySelectorAll('.toggle-btn');

    let accountType = 'user';

    // ============================
    // TOGGLE ADOTANTE / ONG
    // ============================
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;

            if (type === accountType) return;

            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (type === 'ong') {
                accountTypeToggle.classList.add('ong');
            } else {
                accountTypeToggle.classList.remove('ong');
            }

            accountType = type;
            console.log('Account type changed to:', accountType);
        });
    });

    // ============================
    // FORM SUBMISSION (LOGIN)
    // ============================
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        clearErrors();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!validateForm(email, password)) return;

        setLoading(true);

        try {
            // Chama authService.login (mock que você criou)
            const response = await authService.login(email, password, accountType);

            showAlert("Login realizado com sucesso!", "success");

            // Redirecionamento para dashboard correto
            setTimeout(() => {
                if (response.userType === "ong") {
                    window.location.href = "ong-dashboard.html";
                } else {
                    window.location.href = "user-dashboard.html";
                }
            }, 800);

        } catch (error) {
            console.error("Login error:", error);
            showAlert(error.message || "Erro ao fazer login.", "error");
        } finally {
            setLoading(false);
        }
    });

    // ============================
    // FORM VALIDATION
    //============================
    function validateForm(email, password) {
        let valid = true;

        if (!email) {
            showFieldError('email', 'O e-mail é obrigatório');
            valid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Digite um e-mail válido');
            valid = false;
        }

        if (!password) {
            showFieldError('password', 'A senha é obrigatória');
            valid = false;
        } else if (password.length < 8) {
            showFieldError('password', 'A senha deve ter pelo menos 8 caracteres');
            valid = false;
        }

        return valid;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFieldError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorDiv = document.getElementById(`${fieldId}Error`);

        input.classList.add('error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    function clearErrors() {
        loginForm.querySelectorAll('.form-input').forEach(input => input.classList.remove('error'));
        loginForm.querySelectorAll('.form-error').forEach(err => {
            err.classList.add('hidden');
            err.textContent = '';
        });

        document.getElementById('alert-container').innerHTML = '';
    }

    // ============================
    // ALERTS
    // ============================
    function showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
            <div class="alert alert-${type}">
                ${getAlertIcon(type)}
                <span>${message}</span>
            </div>
        `;
    }

    function getAlertIcon(type) {
        const icons = {
            success: `<svg width="20" height="20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"/></svg>`,
            error: `<svg width="20" height="20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.7 7.3a1 1 0 00-1.4 1.4L8.6 10l-1.3 1.3a1 1 0 101.4 1.4L10 11.4l1.3 1.3a1 1 0 001.4-1.4L11.4 10l1.3-1.3a1 1 0 00-1.4-1.4L10 8.6 8.7 7.3z"/></svg>`
        };
        return icons[type] || "";
    }

    // ============================
    // LOADING STATE
    // ============================
    function setLoading(loading) {
        submitBtn.disabled = loading;
        submitBtn.classList.toggle('btn-loading', loading);
    }
});
