import express from "express"
import multer from "multer"

import { GetOneUser, PostUser, PatchUser, ChangePassUser, ResetPassUser, AvatarUser } from "../controllers/user.controller"
import CheckAuthUser from "../middleware/user.guard"

const UserRoutes = express.Router()
const upload = multer()

UserRoutes.post('/signup', PostUser)
/**
 * @swagger
 * /signup:
 *  post:
 *      security: []
 *      summary: Create User
 *      tags: [Handle-Users]
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

UserRoutes.get('/profile', CheckAuthUser, GetOneUser)
/**
 * @swagger
 * /profile:
 *  get:
 *      security:
 *          -   bearerAuth: []
 *      summary: Get User by ID
 *      tags: [Handle-Users]
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: The ID User
 *              required: true
 *      description: >
 *          This resource is used to log into the system
 *      responses:
 *          200:
 *              description: Ok
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Error
 */

UserRoutes.patch('/profile', CheckAuthUser, PatchUser)
/**
 * @swagger
 *  /profile:
 *  patch:
 *      security:
 *          -   bearerAuth: []
 *      summary: Update User
 *      tags: [Handle-Users]
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
 *                      name: name
 *      responses:
 *          200:
 *              description: Ok
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Error
 */

UserRoutes.post('/reset/password', ResetPassUser)
/**
 * @swagger
 *  /reset/password:
 *  post:
 *      security: []
 *      summary: Reset Password
 *      tags: [Handle-Users]
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

UserRoutes.put('/password', CheckAuthUser, ChangePassUser)
/**
 * @swagger
 *  /password:
 *  put:
 *      security:
 *          -   bearerAuth: []
 *      summary: Change Password
 *      tags: [Handle-Users]
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
 *                      oldPassword: oldpassword
 *                      newPassword: newpassword
 *      responses:
 *          200:
 *              description: Ok
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Error
 */

UserRoutes.put('/avatar', upload.single('avatar'), CheckAuthUser, AvatarUser)
/**
 * @swagger
 *  /avatar:
 *  put:
 *      security:
 *          -   bearerAuth: []
 *      summary: Upload Avatar
 *      tags: [Handle-Users]
 *      consumes:
 *          - multipart/form-data
 *          - application/x-www-form-urlencoded
 *          - binary
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
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          avatar:
 *                              type: string
 *                              format: binary
 *      responses:
 *          200:
 *              description: Ok
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Error
 */

export default UserRoutes