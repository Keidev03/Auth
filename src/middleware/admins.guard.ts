import { Response, NextFunction } from "express"
import { IAccessTokenAdmin } from "../utils/token"

const CheckAuthAdmins = (req: any, res: Response, next: NextFunction) => {
    try {
        const admin: IAccessTokenAdmin = req.adminData
        if (admin.super === true) return next()
        return res.status(401).json({ message: 'Insufficient access rights' })

    } catch (error) {
        return res.status(500).json(error)
    }
}

export default CheckAuthAdmins