import mongoose, { Document, model, Model, Schema } from "mongoose";

interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
}

export interface User extends UserDocument {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel: Model<User> = mongoose.model<User>("User", UserSchema);
