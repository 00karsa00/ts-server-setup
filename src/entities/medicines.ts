import mongoose, { Document, model, Model, ObjectId, Schema } from "mongoose";

interface MedicineDocument extends Document {
  _id: mongoose.Types.ObjectId;
}

export interface Medicine extends MedicineDocument {
  userId: { type: ObjectId; required: true };
  name: { type: String; required: true };
  description: { type: String; required: true };
  asDone: { type: Boolean; default: false; required: true };
  type: { type: String; required: true };
  tigger: {};
  date: {};
  time: {};
  endDate: {};
  day: {};
}

const MedicineSchema = new Schema<Medicine>({
  userId: { type: mongoose.Types.ObjectId },
  name: { type: String, required: true },
  description: { type: String, required: true },
  asDone: { type: Boolean, default: false, required: true },
  type: { type: String, required: true },
  tigger: { type: String },
  date: { type: Date },
  time: { type: String },
  endDate: { type: Date },
  day: { type: String },
});

export const UserModel: Model<Medicine> = mongoose.model<Medicine>(
  "Medicine",
  MedicineSchema
);
