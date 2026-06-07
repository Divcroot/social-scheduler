import jwt from 'jsonwebtoken';

export const generateToken = (id: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET must be defined');
    }
    return jwt.sign({_id: id}, secret, {expiresIn: '30d'});
}