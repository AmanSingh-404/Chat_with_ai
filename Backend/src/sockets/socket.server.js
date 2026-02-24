const { Server } = require("socket.io");
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const aiServices = require("../../services/ai.services")

function initSocketServer(httpServer){
    const io = new Server(httpServer)

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
        if(!cookies.token){
            next(new Error("Authenthication error: No token provider"));
        }

        try{
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id)

            socket.user = user

            next()

        }
        catch(err){
            next(new Error("Authencation error: Invalid token"))
        }
    })

    io.on("connection",(socket)=>{
        socket.on("ai-message", async (messagePayload) => {
            console.log(messagePayload)
            const response = await aiServices.genrateResponse(messagePayload.content)
            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })
        })
    })
}

module.exports ={
    initSocketServer    
}   