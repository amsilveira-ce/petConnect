import jwt from 'jsonwebtoken';

export const generateJWTToken = (res, userId, role = 'user') => {
    const token = jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
        expiresIn: '7d', // let it expire in 7 days
    });

    if (process.env.DEBUG_JWT === 'true') {
        console.debug('Generated JWT Token:', token);
    }

    res.cookie('token', token, {
        httpOnly: true, // accessible only by web server
        // secure should be a boolean; only true in production (HTTPS)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match token expiry
    });

    return token;
}

// Provide a default export to avoid import-style mismatches
export default generateJWTToken;