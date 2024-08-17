import jwt from 'jsonwebtoken'

import config from "../config"
import { SetDataRedis } from '../services/redis.service'

export interface IAccessTokenAdmin {
       id: string
       name: string
       super: boolean
       status: boolean
}

export interface IRefreshTokenAdmin {
       name: string
       browser: string
       platform: string
}

export interface IAccessTokenUser {
       id: string
       email: string
       name: string
}

export interface IRefreshTokenUser {
       email: string
       browser: string
       platform: string
}


const AccessTokenAdmin = async (profile: IAccessTokenAdmin): Promise<string> => {
       const accessToken = await jwt.sign({ name: profile.name, super: profile.super, status: profile.status }, config.env.keyAccessToken, { expiresIn: '1h' })
       return accessToken
}

const RefreshTokenAdmin = async (profile: IRefreshTokenAdmin): Promise<string> => {
       const refreshToken = await jwt.sign({ name: profile.name }, config.env.keyRefreshToken, { expiresIn: '15day' })
       SetDataRedis(refreshToken, `admin:${profile.name}:${profile.browser}:${profile.platform}`, { EX: 60 * 60 * 24 * 15 })
       return refreshToken
}

const AccessTokenUser = async (profile: IAccessTokenUser): Promise<string> => {
       const accessToken = await jwt.sign({ id: profile.id, email: profile.email, name: profile.name }, config.env.keyAccessToken, { expiresIn: '1h' })
       return accessToken
}

const RefreshTokenUser = async (profile: IRefreshTokenUser): Promise<string> => {
       const refreshToken = await jwt.sign({ email: profile.email }, config.env.keyRefreshToken, { expiresIn: '15day' })
       SetDataRedis(refreshToken, `user:${profile.email}:${profile.browser}:${profile.platform}`, { EX: 60 * 60 * 24 * 15 })
       return refreshToken
}



export { AccessTokenAdmin, RefreshTokenAdmin, AccessTokenUser, RefreshTokenUser }