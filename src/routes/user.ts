import express from "express"
import multer from "multer"

import { GetOneUser, PatchUser, ChangePassUser, AvatarUser } from "../controllers/user.controller"

const UserRoutes = express.Router()
const upload = multer()

UserRoutes.get('/profile', GetOneUser)
/**
 * @swagger
 * /profile:
 *  get:
 *      security:
 *          -   bearerAuth: []
 *      summary: Get User by ID
 *      tags: [User]
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

UserRoutes.patch('/profile', PatchUser)
/**
 * @swagger
 *  /profile:
 *  patch:
 *      security:
 *          -   bearerAuth: []
 *      summary: Update User
 *      tags: [User]
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


UserRoutes.put('/password', ChangePassUser)
/**
 * @swagger
 *  /password:
 *  put:
 *      security:
 *          -   bearerAuth: []
 *      summary: Change Password
 *      tags: [User]
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

UserRoutes.put('/avatar', upload.single('avatar'), AvatarUser)
/**
 * @swagger
 *  /avatar:
 *  put:
 *      security:
 *          -   bearerAuth: []
 *      summary: Upload Avatar
 *      tags: [User]
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