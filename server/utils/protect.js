const jwt = require('jsonwebtoken');

const User = require('../models/user');
const AppError = require('../utils/AppError');

exports.protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];  // token is sent as Bearer 'jwt_token' so we extract the token from client side
    }

    if(!token){  // if no token found
        return next(new AppError('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id); // in users models, we stored the id in jwt token, so we find user through it
        if(!user){
            return next(new AppError('No user found with this ID', 404));
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return next(new AppError('You are not authorized to access this', 401));
    }
}