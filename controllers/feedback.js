import { spawn } from "child_process";
import feedbackSchema from "../models/feedback.js";
import providerSchema from "../models/provider.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const saveFeedback = async (req, res) => {
  const data = req.body;
  try {
    const savedFeedback = await feedbackSchema.create({
      providerId: data?.providerId,
      userId: data?.userId,
      requirementId: data?.requirementId,
      experience: data?.experience,
      feedback: data?.feedback,
      message: data?.message,
    });
    savedFeedback.save();
    if (!savedFeedback) {
      return res.status(404).json({ message: "Failed to save feedback" });
    }
    const mlCallRes = await mlCall(
      data?.feedback.charAt(0).toUpperCase() + data?.feedback.slice(1)
    )
      .then((res) => {
        return res;
      })
      .catch((error) => console.log(error));
    const rating = mlCallRes.split(" ")[3].split("]")[0].substring(0, 3);
    const providerData = await providerSchema.findOne({
      _id: data?.providerId,
    });
    const avgRating =
      providerData?.avgRating === 0
        ? Number(rating)
        : (providerData?.avgRating + Number(rating)) / 2;
    await providerSchema.findByIdAndUpdate(
      { _id: data?.providerId },
      { rating: avgRating.toFixed(1) },
      { new: true }
    );
    return res.status(200).json(savedFeedback);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const existingFeedback = await feedbackSchema.find();
    return res.status(200).json(existingFeedback);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const mlCall = async (keyword) => {
  try {
    var process = spawn("python", [
      path.join(__dirname, "../feedback.py"),
      keyword,
    ]);
    let output;
    return new Promise((resolve, reject) => {
      process.stdout.on("data", function (data) {
        output = data.toString();
        resolve(output);
      });
    });
  } catch (error) {
    console.log(error);
  }
};
export default { saveFeedback, getFeedbacks };
