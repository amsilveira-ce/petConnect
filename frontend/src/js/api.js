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

// Create singleton instance
const api = new APIClient();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}