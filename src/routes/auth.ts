import express from "express"
import passport from "passport"

import { LoginAdmin, LogoutAdmin } from "../controllers/admin.auth"
import { SignupUser, LoginUser, LoginUserWithGoogle, LogoutUser } from "../controllers/user.auth"
import UpdateTokenUser from "../controllers/token.user.controller"
import UpdateTokenAdmin from "../controllers/token.admin.controller"
import { ResetPassUser } from "../controllers/user.auth"

const AuthRoutes = express.Router()

AuthRoutes.post('/admin/login', LoginAdmin)
/**
 * @swagger
 *  /auth/admin/login:
 *  post:
 *      summary: Login
 *      tags: [Auth-Admin]
 *      parameters: []
 *      description: >
 *          This resource is used to log into the system
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  example:
 *                      name: admin
 *                      password: admin
 *      responses:
 *          200:
 *              description: Ok
 *          500:
 *              description: Error
 */

AuthRoutes.post('/admin/logout', LogoutAdmin)
/**
 * @swagger
 *  /auth/admin/logout:
 *  post:
 *      summary: Logout
 *      tags: [Auth-Admin]
 *      parameters: []
 *      description: >
 *          This resource is used to log outo the system
 *      responses:
 *          200:
 *              description: Ok
 *          500:
 *              description: Error
 */

AuthRoutes.post('/admin/token/refresh', UpdateTokenAdmin)
/**
 * @swagger
 *  /auth/admin/token/refresh:
 *  post:
 *      summary: Refresh token
 *      tags: [Auth-Admin]
 *      parameters: []
 *      description: >
 *          This resource is used to log outo the system
 *      responses:
 *          200:
 *              description: Ok
 *          500:
 *              description: Error
 */

AuthRoutes.post('/signup', SignupUser)
/**
 * @swagger
 * /auth/signup:
 *  post:
 *      security: []
 *      summary: Create User
 *      tags: [Auth-User]
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: The ID User
 *              required: true
 *      description: >
 *          This resource is used to log into the system
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  example:
 *                      email: example@gmail.com
 *                      name: JonhDoe
 *                      password: 123456
 *      responses:
 *          200:
 *              description: Ok
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Error
 */

AuthRoutes.post('/login', LoginUser)
/**
 * @swagger
 *  /auth/login:
 *  post:
 *      summary: Login
 *      tags: [Auth-User]
 *      parameters: []
 *      description: >
 *          This resource is used to log into the system
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  example:
 *                      email: admin@gmail.com
 *                      password: admin
 *      responses:
 *          200:
 *              description: Ok
 *          500:
 *              description: Error
 */

AuthRoutes.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
/**
 * @swagger
 *  /auth/login/google:
 *  get:
 *      summary: Login with Google
 *      tags: [Auth-User]
 *      parameters: []
 *      description: >
 *          This resource is used to log outo the system
 *      responses:
 *          200:
 *              description: Ok
 *          500:
 *              description: Error
 */
AuthRoutes.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }), LoginUserWithGoogle)

AuthRoutes.post('/logout', LogoutUser)
/**
 * @swagger
 *  /auth/logout:
 *  post:
 *      summary: Logout
 *      tags: [Auth-User]
 *      parameters: []
 *      description: >
 *          This resource is used to log outo the system
 *      responses:
 *          200:
 *              description: Ok
 *          500:
 *              description: Error
 */

AuthRoutes.post('/reset/password', ResetPassUser)
/**
 * @swagger
 *  /auth/reset/password:
 *  post:
 *      security: []
 *      summary: Reset Password
 *      tags: [Auth-User]
 *      parameters: []
 *      description: >
 *          This resource is used to log into the system
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  example:
 *                      email: example@gmail.com
 *      responses:
 *          200:
 *              description: Ok
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Error
 */

AuthRoutes.post('/token/refresh', UpdateTokenUser)
/**
 * @swagger
 *  /auth/token/refresh:
 *  post:
 *      summary: Refresh token
 *      tags: [Auth-User]
 *      parameters: []
 *      description: >
 *          This resource is used to log outo the system
 *      responses:
 *          200:
 *              description: Ok
 *          500:
 *              description: Error
 */


export default AuthRoutes