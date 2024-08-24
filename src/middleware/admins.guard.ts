import { Response, NextFunction } from "express"
import { IAccessTokenAdmin } from "../utils/token"

const CheckAuthAdmins = (req: any, res: Response, next: NextFunction) => {
    try {
        const admin: IAccessTokenAdmin = req.adminData
        if (admin.super === true) return next()
        return res.status(401).json({ message: 'Insufficient access rights' })

    } catch (error) {
        console.log("Admins Guard")
        return res.status(401).json({ message: 'Auth failed' })
    }
}

export default CheckAuthAdmins