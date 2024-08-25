import { Request, Response } from "express"
import bcrypt from 'bcryptjs'
import { URL } from "url"
import { generate } from "generate-password"

import { OSelectUser } from "./admin.controller"

import UserSchema, { IUser } from "../models/user.schema"

import { AccessTokenUser, RefreshTokenUser, IAccessTokenUser, IRefreshTokenUser } from "../utils/token"
import { DelDataRedis } from "src/services/redis.service"
import SendMail from "../services/mailer.service"

const SignupUser = async (req: Request, res: Response) => {
    try {
        const { email, name, password, remember = false } = req.body
        const userAgent: any = req.useragent
        const searchUser: IUser = await UserSchema.findOne({ email: email }).select(OSelectUser)
        if (!!searchUser) return res.status(401).json({ message: "Email already exists" })
        const hash = await bcrypt.hash(password, 10)
        const createUser: Record<string, any> = new UserSchema({
            email: email,
            name: name,
            password: hash
        });
        const result: IUser = await createUser.save()

        const dataAccessToken: IAccessTokenUser = { id: result.id, email: result.email, name: result.name }
        const dataRefreshToken: IRefreshTokenUser = { email: result.email, browser: userAgent.browser, platform: userAgent.platform }
        const accessToken = await AccessTokenUser(dataAccessToken)
        const refreshToken = await RefreshTokenUser(dataRefreshToken)
        if (remember) {
            res.cookie('token', refreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict", maxAge: 15 * 24 * 60 * 60 * 1000 })
        } else {
            res.cookie('token', refreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict" })
        }
        res.setHeader('Authorization', accessToken)

        const response: Record<string, any> = {
            status: true,
            message: "Login success",
            id: result.id
        }

        return res.status(201).json(response)

    } catch (error) {
        return res.status(500).json(error);
    }
}

const LoginUser = async (req: Request, res: Response) => {
    try {
        const { email, password, remember = false } = req.body
        const userAgent: any = req.useragent
        const searchUser: IUser = await UserSchema.findOne({ email: email }).select(OSelectUser)
        if (!searchUser) return res.status(500).json({ message: "Email is not registered" })
        if (!searchUser.password) return res.status(500).json({ message: "Password is not registered" })
        const compare: boolean = await bcrypt.compare(password, searchUser.password)
        if (!compare) return res.status(500).json({ message: "Incorrect password" })
        const dataAccessToken: IAccessTokenUser = { id: searchUser.id, email: searchUser.email, name: searchUser.name }
        const dataRefreshToken: IRefreshTokenUser = { email: searchUser.email, browser: userAgent.browser, platform: userAgent.platform }
        const accessToken = await AccessTokenUser(dataAccessToken)
        const refreshToken = await RefreshTokenUser(dataRefreshToken)
        if (remember) {
            res.cookie('token', refreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict", maxAge: 15 * 24 * 60 * 60 * 1000 })
        } else {
            res.cookie('token', refreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict" })
        }
        res.setHeader('Authorization', accessToken)
        const response: Record<string, any> = {
            status: true,
            message: "Login success",
            id: searchUser.id
        }
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json(error)
    }
}


const LoginUserWithGoogle = async (req: Request, res: Response) => {
    const profile: any = req.user
    const { sub: id, email, name, picture } = profile._json
    const userAgent: any = req.useragent
    const searchUser: IUser = await UserSchema.findOne({ email: email }).select(OSelectUser);
    if (searchUser) {
        const dataAccessToken: IAccessTokenUser = { id: searchUser.id, email: searchUser.email, name: searchUser.name }
        const dataRefreshToken: IRefreshTokenUser = { email: searchUser.email, browser: userAgent.browser, platform: userAgent.platform }
        if (searchUser.googleID) {
            const accessToken: string = await AccessTokenUser(dataAccessToken)
            const refreshToken: string = await RefreshTokenUser(dataRefreshToken)
            res.cookie('token', refreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict", maxAge: 15 * 24 * 60 * 60 * 1000 })
            res.setHeader('Authorization', accessToken)
            const response: Record<string, any> = {
                status: true,
                message: "Sign in with your google account successfully",
                id: searchUser.id
            }
            return res.status(200).json(response);
        }
        searchUser.googleID = id;

        try {
            const parsedUrl = new URL(searchUser.avatar)
            const hostname = parsedUrl.hostname
            if (hostname === "lh3.googleusercontent.com") searchUser.avatar = picture
        } catch {
            if (searchUser.avatar === null) searchUser.avatar = picture
        }

        await searchUser.save()
        const accessToken: string = await AccessTokenUser(dataAccessToken);
        const refreshToken: string = await RefreshTokenUser(dataRefreshToken);
        res.cookie('token', refreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict", maxAge: 15 * 24 * 60 * 60 * 1000 })
        res.setHeader('Authorization', accessToken)
        const response: Record<string, any> = {
            status: true,
            message: "Login with your google account successfully",
            id: searchUser.id
        }
        return res.status(200).json(response)

    }
    const createUser: IUser = new UserSchema({
        name: name,
        email: email,
        googleID: id,
        avatar: picture
    });
    const result = await createUser.save()
    const accessToken: string = await AccessTokenUser({ id: result.id, email: email, name: name })
    const refreshToken: string = await RefreshTokenUser({ email: email, browser: userAgent.browser, platform: userAgent.platform })
    res.cookie('token', refreshToken, { httpOnly: true, secure: true, path: '/', sameSite: "strict", maxAge: 15 * 24 * 60 * 60 * 1000 })
    res.setHeader('Authorization', accessToken)
    const response: Record<string, any> = {
        statuss: true,
        message: "Login with your google account successfully",
        id: createUser.id
    }
    return res.status(200).json(response)

};


const LogoutUser = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.token
        if (!refreshToken) return res.status(500).json({ message: "You are not logged in" })
        await DelDataRedis(refreshToken)
        res.clearCookie('token', { path: '/', httpOnly: true, secure: true, sameSite: 'strict' })
        return res.status(200).json({ message: "Logout successfully" })

    } catch (error) {
        return res.status(500).json(error)
    }
}

const ResetPassUser = async (req: Request, res: Response) => {
    try {
        const email = req.body.email
        const searchUser: IUser = await UserSchema.findOne({ email: email }).select(OSelectUser)
        if (!searchUser) return res.status(500).json({ message: "Email doesn't exists" })
        const newPassword: string = generate({
            length: 5,
            numbers: true
        });
        const hash: string = await bcrypt.hash(newPassword, 10)
        await searchUser.updateOne({ password: hash })
        await SendMail(email, newPassword)
        return res.status(200).json({ message: "Refresh password successfully" })

    } catch (error) {
        return res.status(500).json(error)
    }
}


export { SignupUser, LoginUser, LoginUserWithGoogle, LogoutUser, ResetPassUser }