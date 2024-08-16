import mongoose, { Document } from "mongoose"

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    googleID: number,
    avatar: string,
    createdAt: Date;
}

const UserSchema = new mongoose.Schema({
    googleID: { type: Number, default: null },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
    password: { type: String, default: null },
    avatar: { type: String, default: null },
    createdAt: { type: Date, required: true, default: Date.now }
});

UserSchema.index({ googleID: 1, email: 1 })

UserSchema.pre('save', function (next) {
    if (!this.password && !this.googleID) {
        return next(new Error('Either password or googleId must be provided.'))
    } else {
        next();
    }
});

export default mongoose.model<IUser>('user', UserSchema)