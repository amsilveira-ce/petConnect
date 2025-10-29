import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();    


export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log(req)
    console.log('Verifying token:', token);
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return  res.status(401).json({ success: false, message: 'Invalid token. Authorization denied.' });
        }
        console.log(decoded)
        req.userId = decoded.id;
        next();

    } catch (error) {
        console.log('Error verifying token:', error);
        return res.status(401).json({ success: false, message: 'Token verification failed. Authorization denied.' });
    }

}