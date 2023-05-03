import feedbackSchema from "../models/feedback.js";

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

export default { saveFeedback, getFeedbacks };
