// Endpoints para autenticação de usuários e ongs
import express from 'express';
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/auth-controllers.js';


const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/verify-email', verifyEmail);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

// TODO: add verifyToken middleware implementation and import it here.
router.get('/check-auth', checkAuth);

export default router;