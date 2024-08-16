import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import validator from "validator"

import AdminSchema, { IAdmin } from "../models/admin.schema"
import UserSchema, { IUser } from "../models/user.schema"

import { UploadImageDrive, GeneratePublicDrive, DeleteFileDrive } from "../services/drive.service"

import { IAccessTokenAdmin } from "../utils/token"

export const OSelectAdmin: string = 'id name password super status avatar createdAt'
export const OSelectUser: string = 'id googleID email name password avatar createdAt'

// HandleAdmin------------------------------------------------------------------------------------------
const GetOneAdmin = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id
        const result: IAdmin = await AdminSchema.findById(id).select(OSelectAdmin)
        if (!result) return res.status(404).json({ message: 'Administrator not found' })

        const response: Record<string, any> = {
            "data": {
                id: result.id,
                name: result.name,
                password: result.password,
                super: result.super,
                status: result.status,
                avatarID: result.avatar ? `https://drive.google.com/thumbnail?id=${result.avatar}&sz=s500` : null,
                createdAt: result.createdAt
            }
        };
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json(error)
    }
}

const ChangePassAdmin = async (req: any, res: Response) => {
    try {
        const id: string = req.params.id
        const oldPassword: string = req.body.oldPassword
        const newPassword: string = req.body.newPassword
        const checkAdmin: IAccessTokenAdmin = req.adminData
        const searchAdmin: IUser = await AdminSchema.findById(id).select(OSelectAdmin)
        const checkCompare: boolean = await bcrypt.compare(oldPassword, searchAdmin.password)
        if (!checkCompare) return res.status(400).json({ message: "Old password is incorrect" })
        if (checkAdmin.name !== searchAdmin.name) return res.status(403).json({ message: "You're not authenticated" })
        const check: boolean = await bcrypt.compare(newPassword, searchAdmin.password)
        if (check) return res.status(404).json({ message: 'Do not use old passwords' })
        const hash = await bcrypt.hash(newPassword, 10)
        await searchAdmin.updateOne({ password: hash })
        return res.status(200).json({ message: "Changed password successfully" })

    } catch (error) {
        return res.status(500).json(error)
    }
}


const AvatarAdmin = async (req: any, res: Response) => {
    try {
        const fileImage: any = req.file
        const { id, name } = req.adminData as IAccessTokenAdmin
        const searchAdmin: IAdmin = await AdminSchema.findById(id).select(OSelectAdmin);
        if (name !== searchAdmin.name) return res.status(403).json({ message: "You're not authenticated" })
        const idAvatar: string = await UploadImageDrive(fileImage, id)
        await GeneratePublicDrive(idAvatar)
        if (searchAdmin.avatar !== null) await DeleteFileDrive(searchAdmin.avatar)
        await searchAdmin.updateOne({ avatar: idAvatar })
        return res.status(200).json({ message: "Changed avatar successfully" })

    } catch (error) {
        return res.status(500).json(error)
    }
}

// HandleUser------------------------------------------------------------------------------------------

const GetAllUser = async (req: Request, res: Response) => {
    try {
        let page: number = parseInt(req.query.page as string) || 1
        let limit: number = parseInt(req.query.limit as string) || 20
        page = Math.max(1, page)
        limit = Math.min(30, Math.max(1, limit))

        const results: Array<IUser> = await UserSchema.find().select(OSelectUser).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 })
        if (results.length < 1) return res.status(200).json({ message: 'No entries found' })
        const response: Record<string, any> = {
            "data": {
                "count": results.length,
                "items": results.map(result => {
                    return {
                        id: result.id,
                        googleID: result.googleID,
                        email: result.email,
                        name: result.name,
                        password: result.password,
                        avatar: result.avatar ? `https://drive.google.com/thumbnail?id=${result.avatar}&sz=s500` : null,
                        createdAt: result.createdAt
                    }
                })
            }
        }
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json(error)
    }
}


const PatchUser = async (req: Request, res: Response) => {
    try {
        // let response: Record<string, any> = {}
        const id: string = req.params.id
        const dataUpdate = req.body
        if (dataUpdate.password) {
            const hash: string = await bcrypt.hash(dataUpdate.password, 10)
            dataUpdate.password = hash
        }
        if (dataUpdate.email) {
            if (validator.isEmail(dataUpdate.email)) {
                dataUpdate.email = req.body.email
            } else {
                return res.status(200).json({ message: "Invalid email" })
            }
        }
        const result: IUser = await UserSchema.findByIdAndUpdate(id).set(dataUpdate).select(OSelectUser)
        const response: Record<string, any> = {
            message: "User information updated successfully"
        }
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json(error)
    }
}

const DeleteUser = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const result: IUser = await UserSchema.findByIdAndDelete(id).select(OSelectUser)
        return res.status(200).json({ message: "User deletion successful" })

    } catch (error) {
        return res.status(500).json(error)
    }

}


export { GetOneAdmin, AvatarAdmin, ChangePassAdmin }
export { GetAllUser, PatchUser, DeleteUser }