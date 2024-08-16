import { Request, Response } from "express"
import bcrypt from "bcryptjs"

import { OSelectAdmin } from "./admin.controller"

import AdminSchema, { IAdmin } from "../models/admin.schema"

const GetAllAdmin = async (req: Request, res: Response) => {
    try {
        let page: number = parseInt(req.query.page as string) || 1
        let limit: number = parseInt(req.query.limit as string) || 20
        page = Math.max(1, page)
        limit = Math.min(30, Math.max(1, limit))

        const results: Array<IAdmin> = await AdminSchema.find().select(OSelectAdmin).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 })
        if (results.length < 1) return res.status(200).json({ message: 'No entries found' })
        const response: Record<string, any> = {
            "data": {
                "count": results.length,
                "items": results.map(result => {
                    return {
                        id: result.id,
                        name: result.name,
                        password: result.password,
                        super: result.super,
                        status: result.status,
                        avatarID: result.avatar ? `https://drive.google.com/thumbnail?id=${result.avatar}&sz=s500` : null,
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

const PostAdmin = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name
        const password: string = req.body.password
        const hash: string = await bcrypt.hash(password, 10)
        const createAdmin: Record<string, any> = new AdminSchema({
            name: name,
            password: hash,
            status: req.body.status
        })
        const result: IAdmin = await createAdmin.save()
        const response: Record<string, any> = {
            "data": {
                id: result.id,
                name: result.name,
                password: result.password,
                status: result.status,
                super: result.super,
                avatarID: result.avatar ? `https://drive.google.com/thumbnail?id=${result.avatar}&sz=s500` : null,
                createdAt: result.createdAt
            }
        }
        return res.status(201).json(response)

    } catch (error) {
        return res.status(500).json(error)
    }
}

const PatchAdmin = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id
        const dataUpdate: Record<string, any> = req.body
        if (dataUpdate.password) {
            const hash: string = await bcrypt.hash(dataUpdate.password, 10)
            dataUpdate.password = hash
        }
        const result: IAdmin = await AdminSchema.findByIdAndUpdate(id).set(dataUpdate).select(OSelectAdmin)
        const response: Record<string, any> = {
            message: "Updated administrator information successfully"

        };
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json(error)
    }
}

const DeleteAdmin = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id
        await AdminSchema.findByIdAndDelete(id).select(OSelectAdmin)
        return res.status(200).json({ message: "Successfully removed administrator" })

    } catch (error) {
        return res.status(500).json(error)
    }
}

export { GetAllAdmin, PostAdmin, PatchAdmin, DeleteAdmin }