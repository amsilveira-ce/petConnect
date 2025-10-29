
// --- Controladores de Autenticação ---
// utilizam o modelo User para gerenciar usuários e ongs
import User from '../models/user.js';
import ONG from '../models/ong.js';
import bcrypt from 'bcryptjs';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import generateJWTToken from '../utils/generateJWTToken.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail,sendResetSucessEmail } from '../resend/email.js';


export const signup = async (req, res) => {
    const {name, email, password, role = 'user'} = req.body;

    console.log(`Signup request received: Name=${name}, Email=${email}, Role=${role}`);
    
    try {
        // checamos se todos os campos obrigatórios estão presentes
        if (!name || !email || !password) {
            return res.status(400).json({sucess: false, message: 'erro: todos os campos são obrigatórios'});
        }

        // checamos se o tipo de usuário é válido
        if(!['user', 'ong'].includes(role)) {
            return res.status(400).json({sucess: false, message: 'erro: tipo de usuário recebido inválido'});
        }

        // checamos se o email já está em uso
        const userExists = await User.findOne({ email });
        const ongExists = await ONG.findOne({ email });

        if (userExists || ongExists) {
            return res.status(400).json({ message: 'Email já está sendo utilizado' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = generateVerificationToken();

        let account;
        if (role === 'ong') {
            // Ong campo adicional obrigatório
            const { phone, address } = req.body;
            
            if (!phone || !address || !address.street || !address.city || !address.state || !address.zipCode) {
                // para registro de ONG, telefone e endereço completo são obrigatórios
                return res.status(400).json({ message: 'Para registro de ONG, telefone e endereço completo são obrigatórios' });
            }

            account = new ONG({
                name,
                email,
                password: hashedPassword,
                phone,
                address,
                verificationToken: verificationToken,
                verificationTokenExpiresAt: Date.now() + 3600000 * 24,
            });

        } else {
            // usuário comum
            account = new User({
                name,
                email,
                password: hashedPassword,
                verificationToken: verificationToken,
                verificationTokenExpiresAt: Date.now() + 3600000 * 24,
            });
        }

        await account.save();

        generateJWTToken(res, account._id, role);

        await sendVerificationEmail(email, verificationToken);

        res.status(200).json({
            success: true,
            message: 'Conta criada com sucesso! Por favor, verifique seu email para ativar sua conta.',
            account: { ...account._doc, password: undefined },
            role: role
        });


    } catch (error) {
        console.error('Erro durante o cadastro:', error);
        res.status(500).json({ success: false, message: 'Erro no servidor durante o cadastro. Por favor, tente novamente mais tarde.' + error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Try to find in User collection first
        let account = await User.findOne({ email }).select('+password');
        let role = 'user';

        // If not found, try ONG collection
        if (!account) {
            account = await ONG.findOne({ email }).select('+password');
            role = 'ong';
        }

        if (!account) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isPasswordValid = await account.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Check if verified
        if (!account.isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email not verified. Please verify your email to login.' 
            });
        }

        // Update last login
        await account.updateLastLogin();

        // Generate JWT token with role
        generateJWTToken(res, account._id, role);

        res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            account: { ...account._doc, password: undefined },
            role: role
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Error in login: ' + error.message 
        });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logout successful' });
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        // Try User first
        let account = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        let role = 'user';

        // If not found, try ONG
        if (!account) {
            account = await ONG.findOne({
                verificationToken: code,
                verificationTokenExpiresAt: { $gt: Date.now() }
            });
            role = 'ong';
        }

        if (!account) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired verification token' 
            });
        }

        account.isVerified = true;
        account.verificationToken = undefined;
        account.verificationTokenExpiresAt = undefined;
        await account.save();

        await sendWelcomeEmail(account.email, account.name);

        res.status(200).json({ 
            success: true, 
            message: 'Email verified successfully',
            role: role
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Error verifying email: ' + error.message 
        });
    }
};

// Não está funcionando corretamente - precisa ajustar o endpoint
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Try User first
        let account = await User.findOne({ email });

        // If not found, try ONG
        if (!account) {
            account = await ONG.findOne({ email });
        }

        if (!account) {
            return res.status(400).json({ 
                success: false, 
                message: 'No account found with this email' 
            });
        }

        const resetPasswordToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour

        account.resetPasswordExpiresAt = resetPasswordExpiresAt;
        account.resetPasswordToken = resetPasswordToken;
        await account.save();

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetLink = `${clientUrl}/#reset-password?token=${encodeURIComponent(resetPasswordToken)}`;
        
        await sendPasswordResetEmail(account.email, resetLink);

        res.status(200).json({ 
            success: true, 
            message: 'Password reset email sent successfully' 
        });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Error in forgot password: ' + error.message 
        }); 
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password is required' 
            });
        }

        // Try User first
        let account = await User.findOne({
            resetPasswordToken: token, 
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        // If not found, try ONG
        if (!account) {
            account = await ONG.findOne({
                resetPasswordToken: token, 
                resetPasswordExpiresAt: { $gt: Date.now() }
            });
        }

        if (!account) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired password reset token' 
            });
        }

        // The password will be hashed by the pre-save hook
        account.password = newPassword;
        account.resetPasswordToken = undefined;
        account.resetPasswordExpiresAt = undefined;
 
        await account.save();  
        await sendResetSuccessEmail(account.email);

        return res.status(200).json({ 
            success: true, 
            message: 'Password reset successful' 
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Error in reset password: ' + error.message 
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const { userId, userRole } = req;

        let account;
        
        if (userRole === 'ong') {
            account = await ONG.findById(userId);
        } else {
            account = await User.findById(userId);
        }

        if (!account) {
            return res.status(400).json({ 
                success: false, 
                message: 'Account not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Account is authenticated', 
            account: { ...account._doc, password: undefined },
            role: userRole
        });

    } catch (error) {
        console.error('Check auth error:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Error checking authentication: ' + error.message 
        });
    }
};

