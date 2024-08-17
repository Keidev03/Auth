import jwt from 'jsonwebtoken'
import { Request, Response } from "express"

import config from '../config'

import AdminSchema from '../models/admin.schema'

import { AccessTokenAdmin, RefreshTokenAdmin, IAccessTokenAdmin } from "../utils/token"
import { DelDataRedis, GetDataRedis } from 'src/services/redis.service'

const UpdateTokenAdmin = async (req: Request, res: Response) => {
    try {
        const oldRefreshToken: string = req.cookies.token
        const userAgent: any = req.useragent
        if (!oldRefreshToken) return res.status(401).json({ message: "You're not authenticated" })
        const checkRefreshToken: any = await GetDataRedis(oldRefreshToken)
        if (!checkRefreshToken) return res.status(403).json({ message: "refreshToken is incorrect" })
        const decoded: any = await jwt.verify(oldRefreshToken, config.env.keyRefreshToken)
        const result: any = await AdminSchema.findOne({ name: decoded.name }).select('name super status')
        const dataAccessToken: IAccessTokenAdmin = { id: result.id, name: result.name, super: result.super, status: result.status }
        const dataRefreshToken = { name: decoded.name, browser: userAgent.browser, platform: userAgent.platform }
        const newAccessToken: string = await AccessTokenAdmin(dataAccessToken)
        const newRefreshToken: string = await RefreshTokenAdmin(dataRefreshToken)
        await DelDataRedis(oldRefreshToken)
        res.cookie("token", newRefreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict" })
        res.setHeader('Authorization', newAccessToken)
        return res.status(200).json({ message: "Token update successful" })

    } catch (error) {
        return res.status(500).json(error)
    }
}
export default UpdateTokenAdmin