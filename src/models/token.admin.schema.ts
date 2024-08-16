import mongoose, { Date, Document } from "mongoose"

export interface ITokenAdmin extends Document {
    name: string,
    token: string,
    date: Date,
}

const TokenAdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    date: { type: Date, required: true, default: Date.now },
});

export default mongoose.model<ITokenAdmin>('tokenadmin', TokenAdminSchema)