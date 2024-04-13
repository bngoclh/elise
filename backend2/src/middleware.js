// Middleware function to check if user is authenticated
const authService = require('./services/auth.service');

exports.preAuthMiddlewareAdmin = (req, res, next) => {
    // Extract token from Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    authService.verifyToken(token)
        .then(decoded => {
            if (decoded.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        })
        .catch(err => res.status(401).json({ message: 'Token is invalid' }));
}

exports.preAuthMiddlewareAdminOrUser = (req, res, next) => {
    // Extract token from Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    authService.verifyToken(token)
        .then(decoded => {
            if (decoded.role !== 'ADMIN' && decoded.role !== 'USER') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        })
        .catch(err => res.status(401).json({ message: 'Token is invalid' }));
}

exports.preAuthMiddlewareAdminOrExactUser = (req, res, next) => {
    // Extract token from Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    authService.verifyToken(token)
        .then(decoded => {
            if (decoded.role !== 'ADMIN' && decoded._id !== req.params.id) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        })
        .catch(err => res.status(401).json({ message: 'Token is invalid' }));
}