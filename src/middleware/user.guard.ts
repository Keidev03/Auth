import jwt, { JwtPayload } from 'jsonwebtoken'
import { Response, NextFunction } from "express"

import config from "../config"

import { IAccessTokenUser } from "../utils/token"

const CheckAuthUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const accessToken: any = req.headers.authorization?.split(" ")[1]
        const decoded = await jwt.verify(accessToken, config.env.keyAccessToken) as IAccessTokenUser | JwtPayload
        req.userData = decoded
        return next();
    } catch (error) {
        console.log("User Guard")
        return res.status(401).json({ message: 'Auth failed' })
    }
}

export default CheckAuthUser