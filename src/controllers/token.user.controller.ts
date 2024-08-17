import jwt from 'jsonwebtoken'
import { Request, Response } from "express"

import config from "../config"

import { OSelectUser } from './admin.controller'

import UserSchema, { IUser } from '../models/user.schema'

import { AccessTokenUser, RefreshTokenUser, IAccessTokenUser, IRefreshTokenUser } from "../utils/token"
import { DelDataRedis, GetDataRedis } from '../services/redis.service'

const UpdateTokenUser = async (req: Request, res: Response) => {
    try {
        const oldRefreshToken: string = req.cookies.token
        const userAgent: any = req.useragent
        if (!oldRefreshToken) return res.status(401).json({ message: "You're not authenticated" })
        const checkRefreshToken: any = await GetDataRedis(oldRefreshToken)
        if (!checkRefreshToken) return res.status(403).json({ message: "refreshToken is incorrect" })
        const decoded: any = await jwt.verify(oldRefreshToken, config.env.keyRefreshToken)
        const searchUser: IUser = await UserSchema.findOne({ email: decoded.email }).select(OSelectUser)
        const dataAccessToken: IAccessTokenUser = { id: searchUser.id, email: searchUser.email, name: searchUser.name }
        const dataRefreshToken: IRefreshTokenUser = { email: searchUser.email, browser: userAgent.browser, platform: userAgent.platform }
        const newAccessToken = await AccessTokenUser(dataAccessToken)
        const newRefreshToken = await RefreshTokenUser(dataRefreshToken)
        await DelDataRedis(oldRefreshToken)
        res.cookie('token', newRefreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict" })
        res.setHeader('Authorization', newAccessToken)
        return res.status(200).json({ message: "Token update successful" })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export default UpdateTokenUser