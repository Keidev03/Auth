import express from 'express'

import { GetAllAdmin, PatchAdmin, PostAdmin, DeleteAdmin } from "../controllers/super.controller"

const AdminsRoutes = express.Router()
/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT 
 */
AdminsRoutes.get('/', GetAllAdmin)
AdminsRoutes.post('/', PostAdmin)
AdminsRoutes.patch('/:id', PatchAdmin)
AdminsRoutes.delete('/:id', DeleteAdmin)

export default AdminsRoutes