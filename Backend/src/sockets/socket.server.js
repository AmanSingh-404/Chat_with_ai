const { Server } = require("socket.io");
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const aiServices = require("../../services/ai.services")
const messageModel = require("../models/message.model")

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

            await messageModel.create({
                chat:messagePayload.chat,
                user:socket.user._id,
                content:messagePayload.content,
                role:"user"
            })

            // make short term history firstly create a chatHistory
            const chatHistory = await messageModel.find({
                chat:messagePayload.chat
            })

            // make short term history
            const response = await aiServices.genrateResponse(chatHistory.map(item => {
                return {
                    role:item.role,
                    parts: [{text: item.content}]
                }
            }))

            await messageModel.create({
                chat:messagePayload.chat,
                user:socket.user._id,
                content:response,
                role:"model"
            })

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