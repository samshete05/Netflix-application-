const jwt = require('jsonwebtoken');
const JWT_SECRET = '1234567';

const createToken = (userId) => {
  
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ status: 'error', error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 'error', error: 'Failed to authenticate token' });
        }
       
        req.userId = decoded.id;
        next();
    });
};

module.exports = {createToken,verifyToken}