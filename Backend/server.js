require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/db/db")
const {initSocketServer} = require("./src/sockets/socket.server")
const httpserver = require("http").createServer(app)

connectDB()
initSocketServer(httpserver)

httpserver.listen(3000, ()=>{
    console.log("server running on port 3000")
})