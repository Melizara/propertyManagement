import mongoose, { Document, Schema } from "mongoose";

// Interface TypeScript pour un utilisateur
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
}

// Schema Mongoose pour User
const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Export du modèle
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
