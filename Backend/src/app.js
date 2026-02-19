const express = require("express")
const cookieparser = require("cookie-parser")
const AuthRoutes = require("./routes/auth.routes")
const chatRoutes = require("../src/routes/chat.routes")

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use('/api/auth', AuthRoutes)
app.use('/api/chat', chatRoutes)

module.exports = app