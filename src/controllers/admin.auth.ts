import { Request, Response } from "express"
import bcrypt from 'bcryptjs'

import { OSelectAdmin } from "./admin.controller"

import AdminSchema from "../models/admin.schema"

import { AccessTokenAdmin, IAccessTokenAdmin, IRefreshTokenAdmin, RefreshTokenAdmin } from "../utils/token"
import { DelDataRedis } from "../services/redis.service"

const LoginAdmin = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name
        const password: string = req.body.password
        const userAgent: any = req.useragent
        const searchAdmin: any = await AdminSchema.findOne({ name: name }).select(OSelectAdmin)
        if (!searchAdmin) return res.status(404).json({ message: "Invalid login name" })
        const compare: boolean = await bcrypt.compare(password, searchAdmin.password)
        if (!compare) return res.status(404).json({ message: "Wrong password" })
        const dataAccessToken: IAccessTokenAdmin = { id: searchAdmin.id, name: searchAdmin.name, super: searchAdmin.super, status: searchAdmin.status }
        const dataRefreshToken: IRefreshTokenAdmin = { name: searchAdmin.name, browser: userAgent.browser, platform: userAgent.platform }
        const accessToken: string = await AccessTokenAdmin(dataAccessToken)
        const refreshToken: string = await RefreshTokenAdmin(dataRefreshToken)
        res.cookie("token", refreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict" })
        res.setHeader('Authorization', accessToken)
        const response: Record<string, any> = {
            status: true,
            message: "Login success",
            id: searchAdmin.id
        }
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json(error)
    }
}

const LogoutAdmin = async (req: Request, res: Response) => {
    try {
        const refreshToken: string = req.cookies.token

        if (!refreshToken) return res.status(500).json({ message: "You are not logged in" })

        await DelDataRedis(refreshToken)
        res.clearCookie('token', { path: '/', httpOnly: true, secure: true, sameSite: 'strict' })
        return res.status(200).json({ message: "Logout success" })

    } catch (error) {
        return res.status(500).json(error)
    }
}

export { LoginAdmin, LogoutAdmin }