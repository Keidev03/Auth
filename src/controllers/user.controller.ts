import bcrypt from 'bcryptjs'
import { Request, Response } from "express"
import generate from 'generate-password'

import { OSelectUser } from './admin.controller'

import UserSchema, { IUser } from "../models/user.schema"

import SendMail from '../services/mailer.service'
import { DeleteFileDrive, GeneratePublicDrive, UploadImageDrive } from '../services/drive.service'

const GetOneUser = async (req: any, res: Response) => {
    try {
        const { id, email, name } = req.userData
        const result: IUser = await UserSchema.findById(id).select(OSelectUser)
        if (!result) return res.status(500).json({ message: "User not found" })
        const response: Record<string, any> = {
            "data": {
                id: result.id,
                GoogleID: result.googleID,
                Email: result.email,
                Name: result.name,
                Password: result.password,
                Avatar: result.avatar ? `https://drive.google.com/thumbnail?id=${result.avatar}&sz=s500` : null,
                createdAt: result.createdAt
            }
        }
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json(error)
    }
}

const PostUser = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;
        const searchUser: IUser = await UserSchema.findOne({ email: email }).select(OSelectUser)
        if (!!searchUser) return res.status(401).json({ message: "Email already exists" })
        const hash = await bcrypt.hash(password, 10)
        const createUser: Record<string, any> = new UserSchema({
            email: email,
            name: name,
            password: hash
        });
        const result: IUser = await createUser.save()
        const response: Record<string, any> = {
            "data": {
                id: result.id,
                googleID: result.googleID,
                email: result.email,
                name: result.name,
                password: result.password,
                avatar: result.avatar ? `https://drive.google.com/thumbnail?id=${result.avatar}&sz=s500` : null,
                createdAt: result.createdAt
            }
        }
        return res.status(201).json(response)

    } catch (error) {
        return res.status(500).json(error);
    }
}

const PatchUser = async (req: any, res: Response) => {
    try {
        const { id, email, name } = req.userData
        const dataUpdate = { name }
        if (name) dataUpdate.name = name
        await UserSchema.findByIdAndUpdate(id).set(dataUpdate).select(OSelectUser)
        return res.status(200).json({ message: "Information changed successfully" })

    } catch (error) {
        return res.status(500).json(error)
    }
}

const ChangePassUser = async (req: any, res: Response) => {
    try {
        const { id, email, name } = req.userData
        const oldPassword: string = req.body.oldPassword
        const newPassword: string = req.body.newPassword
        const searchUser: IUser = await UserSchema.findById(id).select(OSelectUser)
        const checkCompare: boolean = await bcrypt.compare(oldPassword, searchUser.password)
        if (!checkCompare) return res.status(400).json({ message: "Old password is incorrect" })
        const check: boolean = await bcrypt.compare(newPassword, searchUser.password)
        if (check) return res.status(500).json({ message: 'Do not use old passwords' })
        const hash = await bcrypt.hash(newPassword, 10)
        await searchUser.updateOne({ password: hash })
        return res.status(200).json({ message: "Changed password successfully" })

    } catch (error) {
        return res.status(500).json(error);
    }
}

const ResetPassUser = async (req: Request, res: Response) => {
    try {
        const email = req.body.email
        const searchUser: IUser = await UserSchema.findOne({ email: email }).select(OSelectUser)
        if (!searchUser) return res.status(500).json({ message: "Email doesn't exists" })
        const newPassword: string = generate.generate({
            length: 5,
            numbers: true
        });
        const hash: string = await bcrypt.hash(newPassword, 3)
        await searchUser.updateOne({ password: hash })
        await SendMail(email, newPassword)
        return res.status(200).json({ message: "Refresh password successfully" })

    } catch (error) {
        return res.status(500).json(error)
    }
}

const AvatarUser = async (req: any, res: Response) => {
    try {
        const { id, email, name } = req.userData
        const searchUser: IUser = await UserSchema.findById(id).select(OSelectUser)
        if (!searchUser) return res.status(500).json({ message: "User does't exists" })
        const avatar = req.file
        const idAvatar: string = await UploadImageDrive(avatar, searchUser.id)
        await GeneratePublicDrive(idAvatar)
        if (searchUser.avatar !== null) await DeleteFileDrive(searchUser.avatar)
        await searchUser.updateOne({ avatar: idAvatar })
        return res.status(200).json({ message: "Changed avatar successfully" })

    } catch (error) {
        return res.status(500).json(error)
    }
}

export { GetOneUser, PostUser, PatchUser, ChangePassUser, ResetPassUser, AvatarUser }