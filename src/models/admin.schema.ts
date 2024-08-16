import mongoose, { Document } from "mongoose"

export interface IAdmin extends Document {
    name: string,
    password: string,
    super: string,
    status: boolean,
    avatar: string,
    createdAt: Date
};

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    super: { type: Boolean, default: false },
    status: { type: Boolean, required: true },
    avatar: { type: String, default: null },
    createdAt: { type: Date, required: true, default: Date.now }
});

AdminSchema.index({ name: 1 })


export default mongoose.model<IAdmin>('admin', AdminSchema)