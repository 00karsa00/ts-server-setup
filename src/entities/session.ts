import mongoose, { Document, Schema, model } from "mongoose";

export interface Session extends Document {
  userId: string;
  device: string;
  ip: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

const SessionSchema = new Schema<Session>(
  {
    userId: { type: String, required: true, index: true },
    device: { type: String, required: true },
    ip: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SessionModel = model<Session>("Session", SessionSchema);
