const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function authUser(req, res, next) {
    const {token} = req.cookies;

    if(!token){
        res.status(401).json({message:"Unothorized"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id)

        req.user = user;

        next()

    }catch(err){
        res.status(401).json({message:"Unothorized"})
    }
}

module.exports = {
    authUser
}