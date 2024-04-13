/* Generate a JWT token */
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret';

exports.generateAuthToken = (user) => {
    const payload = {
        _id: user._id,
        username: user.username,
        name: user.name,
        role: user.role
    };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;
}

exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
}