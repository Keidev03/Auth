import mongoose, { Date, Document } from "mongoose"

export interface ITokenUser extends Document {
    token: string,
    date: Date
}

const TokenUserSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    date: { type: Date, required: true, default: Date.now }
});

export default mongoose.model<ITokenUser>('tokenuser', TokenUserSchema)