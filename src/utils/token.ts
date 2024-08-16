import jwt from 'jsonwebtoken'

import config from "../config"

import TokenUserSchema, { ITokenUser } from "../models/token.user.schema"
import TokenAdminSchema, { ITokenAdmin } from '../models/token.admin.schema'
import mongoose from 'mongoose'

export interface IAccessTokenAdmin {
    id: string
    name: string
    super: boolean
    status: boolean
}

export interface IRefreshTokenAdmin {
    name: string
}

export interface IAccessTokenUser {
    id: string
    email: string
    name: string
}

export interface IRefreshTokenUser {
    email: string
}

const AccessTokenAdmin = async (profile: IAccessTokenAdmin): Promise<string> => {
    const accessToken = await jwt.sign({ name: profile.name, super: profile.super, status: profile.status }, config.env.keyAccessToken, { expiresIn: '30d' })
    return accessToken

}

const RefreshTokenAdmin = async (profile: IRefreshTokenAdmin): Promise<string> => {
    const refreshToken = await jwt.sign({ name: profile.name }, config.env.keyRefreshToken, { expiresIn: '30d' })
    const createToken: ITokenAdmin = new TokenAdminSchema({
        name: profile.name,
        token: refreshToken,
        date: new Date(),
    })
    await createToken.save()
    return refreshToken

}

const AccessTokenUser = async (profile: IAccessTokenUser): Promise<string> => {
    const accessToken = await jwt.sign({ id: profile.id, email: profile.email, name: profile.name }, config.env.keyAccessToken, { expiresIn: '30d' })
    return accessToken
}

const RefreshTokenUser = async (profile: IRefreshTokenUser): Promise<string> => {
    const refreshToken = await jwt.sign({ email: profile.email }, config.env.keyRefreshToken, { expiresIn: '30d' })
    const createToken: ITokenUser = new TokenUserSchema({
        token: refreshToken,
        date: new Date()
    })
    await createToken.save()
    return refreshToken
}

export { AccessTokenAdmin, RefreshTokenAdmin, AccessTokenUser, RefreshTokenUser }