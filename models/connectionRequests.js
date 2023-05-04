import mongoose, { Schema } from "mongoose";

const connectionRequestSchema = mongoose.Schema(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "provider" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    requirementId: { type: Schema.Types.ObjectId, ref: "requirements" },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
    sentBy: { type: String, enum: ["user", "provider"] },
  },
  { timestamps: true }
);

export default mongoose.model("connectionRequests", connectionRequestSchema);
