const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        console.error("No token provided");
        return res.status(403).json({
            status: 403,
            message: 'Token expired'
        });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err.message);
            return res.status(403).json({
                status: 403,
                message: err.message,
                error: err
            });
        }

        req.user = user;
       
        req.isAdmin = user.isAdmin ? true : false;
        next();
    });
}

module.exports = {
    authenticateToken
};


function isAdmin(req, res, next) {
    if (req.isAdmin) {
        next();
    } else {
        return res.status(403).json({
            status: 403,
            message: 'Unauthorized access - Admins only'
        });
    }
}

module.exports = {
    authenticateToken,
    isAdmin
};
