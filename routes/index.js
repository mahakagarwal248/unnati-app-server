import express from "express";
import userRoutes from "./user";
import providerRoutes from "./provider";
import sendEmail from "../controllers/sendEmail";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/provider", providerRoutes);
router.post("/send-email", sendEmailFunction);

export default router;
