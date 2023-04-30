import mongoose, { Schema } from "mongoose";

const requirementsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    address: { type: String, required: true },
    service: { type: String, required: true },
    experience: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("requirements", requirementsSchema);
