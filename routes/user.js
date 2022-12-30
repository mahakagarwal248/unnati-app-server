import express from "express";

import userCtrl from "../controllers/user.js";

const router = express.Router();

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/fetch-security-ques", userCtrl.fetchSecurityQues);
router.post("/match-security-ans", userCtrl.matchSecurityAns);
router.post("/change-password", userCtrl.changePassword)

export default router;
