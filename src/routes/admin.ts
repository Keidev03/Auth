import express from "express"
import multer from "multer"

import { GetOneAdmin, AvatarAdmin, ChangePassAdmin, GetAllUser, PatchUser, DeleteUser } from "../controllers/admin.controller"

const AdminRoutes = express.Router()
const upload = multer()


AdminRoutes.get('/profile', GetOneAdmin)
/**
 * @swagger
 *  /admin/profile:
 *  get:
 *      security:
 *          -   bearerAuth: []
 *      summary: Get Admin by ID
 *      tags: [Handle-Admins]
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: The ID Admin
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

AdminRoutes.put('/avatar', upload.single('avatar'), AvatarAdmin)
/**
 * @swagger
 *  /admin/avatar:
 *  put:
 *      security:
 *          -   bearerAuth: []
 *      summary: Upload Avatar
 *      tags: [Handle-Admins]
 *      consumes:
 *          - multipart/form-data
 *          - application/x-www-form-urlencoded
 *          - binary
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: The ID Admin
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

AdminRoutes.put('/password', ChangePassAdmin)
/**
 * @swagger
 *  /admin/password:
 *  put:
 *      security:
 *          -   bearerAuth: []
 *      summary: Change Password
 *      tags: [Handle-Admins]
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: The ID Admin
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

AdminRoutes.get('/users', GetAllUser)
/**
 * @swagger
 *  /admin/users:
 *  get:
 *      security:
 *          -   bearerAuth: []
 *      summary: Get All User
 *      tags: [Handle-Admins]
 *      parameters: []
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

AdminRoutes.patch('/users/:id', PatchUser)
/**
 * @swagger
 *  /admin/users/{id}:
 *  patch:
 *      security:
 *          -   bearerAuth: []
 *      summary: Update User
 *      tags: [Handle-Admins]
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
 *                      email: name
 *                      name: newpassword
 *                      password: pass
 *                      avatar: null
 *      responses:
 *          200:
 *              description: Ok
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Error
 */

AdminRoutes.delete('/users/:id', DeleteUser)
/**
 * @swagger
 *  /admin/users/{id}:
 *  delete:
 *      security:
 *          -   bearerAuth: []
 *      summary: Delete User
 *      tags: [Handle-Admins]
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

export default AdminRoutes