const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function registerUser(req, res) {
    const {username, email, password} = req.body

    const isUserExists = await userModel.findOne({email})

    if(isUserExists){
        res.status(400).json({message:"user already exists"})
    }
    const hashpassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({username, email, password:hashpassword})

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"365d"})
    res.cookie("token",token)
    res.status(201).json({message:"user registered successfully", user})
}

async function loginUser(req, res) {
    const {username, email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        res.status(400).json({message:"user does not exist"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        res.status(400).json({message:"invalid credentials"})
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"365d"})
    res.cookie("token",token)
    res.status(201).json({message:"user logged in successfully", user})
}

module.exports = {
    registerUser,
    loginUser
}