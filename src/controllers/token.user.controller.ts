import jwt from 'jsonwebtoken'
import { Request, Response } from "express"

import config from "../config"

import { OSelectUser } from './admin.controller'

import TokenUserSchema from "../models/token.user.schema"
import UserSchema, { IUser } from '../models/user.schema'

import { IAccessTokenUser, AccessTokenUser, RefreshTokenUser, IRefreshTokenUser } from '../utils/token'

const UpdateTokenUser = async (req: Request, res: Response) => {
    try {
        const oldRefreshToken: string = req.cookies.token
        if (!oldRefreshToken) return res.status(401).json({ message: "You're not authenticated" })
        const checkRefreshToken: Record<string, any> = await TokenUserSchema.findOne({ token: oldRefreshToken }).select('token')
        if (!checkRefreshToken) return res.status(403).json({ message: "refreshToken is incorrect" })
        const decoded: any = await jwt.verify(oldRefreshToken, config.env.keyRefreshToken)
        const searchUser: IUser = await UserSchema.findOne({ email: decoded.email }).select(OSelectUser)
        const dataAccessToken: IAccessTokenUser = { id: searchUser.id, email: searchUser.email, name: searchUser.name }
        const dataRefreshToken: IRefreshTokenUser = { email: searchUser.email }
        const newAccessToken = await AccessTokenUser(dataAccessToken)
        const newRefreshToken = await RefreshTokenUser(dataRefreshToken)
        await checkRefreshToken.deleteOne()
        res.cookie('token', newRefreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict" })
        res.setHeader('Authorization', newAccessToken)
        return res.status(200).json({ message: "Token update successful" })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export default UpdateTokenUser