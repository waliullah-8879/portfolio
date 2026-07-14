import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'portfolio_secret_key'

export function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'No token provided' })
    try {
        req.user = jwt.verify(token, SECRET)
        next()
    } catch {
        res.status(401).json({ message: 'Invalid token' })
    }
}
