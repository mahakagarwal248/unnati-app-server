import express from "express";

import feedbackCtrl from "../controllers/feedback.js";

const router = express.Router();

router.post("/save", feedbackCtrl.saveFeedback);
router.get("/get", feedbackCtrl.getFeedbacks);

export default router;
