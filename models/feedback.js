import mongoose, { Schema } from "mongoose";

const feedbackSchema = mongoose.Schema(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "provider" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    requirementId: { type: Schema.Types.ObjectId, ref: "requirements" },
    experience: { type: String, default: "" },
    feedback: { type: String, default: "" },
    message: { type:String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("feedbacks", feedbackSchema);
