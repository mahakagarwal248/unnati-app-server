import mongoose from "mongoose";

const requirementsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    address: { type: String, required: true },
    service: { type: String, required: true },
    experience: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("requirements", requirementsSchema);
