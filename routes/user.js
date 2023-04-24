import express from "express";

import userCtrl from "../controllers/user.js";

const router = express.Router();

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/get-user-data", userCtrl.getUserData);
router.get("/fetch-security-ques", userCtrl.fetchSecurityQues);
router.post("/match-security-ans", userCtrl.matchSecurityAns);
router.post("/change-password", userCtrl.changePassword);
router.post("/save-requirements", userCtrl.saveRequirements);
router.get("/get-requirements", userCtrl.getRequirements);
router.post("/update-user", userCtrl.updateUser);

export default router;
