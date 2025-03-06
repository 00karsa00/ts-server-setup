import mongoose, { Document, model, Model, ObjectId, Schema } from "mongoose";

export interface Medicine extends Document {
  userId: string,
  name: string;
  description: string;
  asDone?: boolean;
  type: "oneTimeOnly" | "recurring";
  recurringType?: "daily" | "weekly";
  date?: string; 
  time?: string; 
  endDate?: string; 
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
}

const MedicineSchema = new Schema<Medicine>(
  {
    userId: String,
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    asDone: { type: Boolean, default: false },
    type: { type: String, required: true, enum: ["oneTimeOnly", "recurring"] },
    recurringType: { type: String, enum: ["daily", "weekly"], required: function () {
        return this.type === "recurring";
      } 
    },
    date: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ }, 
    time: { type: String, match: /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/ }, 
    endDate: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ }, 
    day: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    },
  },
  { timestamps: true }
);

export const MedicineModel = mongoose.model<Medicine>("Medicine", MedicineSchema);
