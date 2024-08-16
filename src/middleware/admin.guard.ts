import { Response, NextFunction } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'

import config from "../config"

import { IAccessTokenAdmin } from "../utils/token"

const CheckAuthAdmin = async (req: any, res: Response, next: NextFunction) => {
    try {
        const accessToken: string = req.headers.authorization?.split(" ")[1]
        const decoded = await jwt.verify(accessToken, config.env.keyAccessToken) as IAccessTokenAdmin | JwtPayload
        req.adminData = decoded
        return next()
    } catch (error) {
        return res.status(401).json({ message: 'Auth failed' })
    }
}

export default CheckAuthAdmin