import express from "express"
import swaggerUI from 'swagger-ui-express'

import config from "./config"

import MongoDB from "./database/mongodb"
import GoogleOauth20 from "./services/googleOauth20.service"

import AdminsRoutes from "./routes/admins"
import AdminRoutes from "./routes/admin"
import UserRoutes from "./routes/user"
import AuthRoutes from "./routes/auth"

import CheckAuthAdmin from "./middleware/admin.guard"
import CheckAuthAdmins from "./middleware/admins.guard"
import CheckAuthUser from "./middleware/user.guard"

import specs from "./utils/swagger"

const app = express()

config.App(app)
GoogleOauth20()
MongoDB()

app.use('/auth', AuthRoutes)
app.use('/admins', CheckAuthAdmin, CheckAuthAdmins, AdminsRoutes)
app.use('/admin', CheckAuthAdmin, AdminRoutes)
app.use('/user', CheckAuthUser, UserRoutes)
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(specs))

try {
    app.listen(config.env.port, () => {
        console.log(`App listen on\nURL: ${config.env.baseURL}\nPORT: ${config.env.port}`)
    })
} catch (error) {
    throw error
}