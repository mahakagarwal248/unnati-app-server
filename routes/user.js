import express from "express";

import userCtrl from "../controllers/user.js";
import sendEmailFunction from "../controllers/sendEmailFunction.js";

const router = express.Router();

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/get-user-data", userCtrl.getUserData);
router.get("/fetch-security-ques", userCtrl.fetchSecurityQues);
router.get("/match-security-ans", userCtrl.matchSecurityAns);
router.get("/change-password", userCtrl.changePassword);
router.post("/save-requirements", userCtrl.saveRequirements);
router.get("/get-requirements", userCtrl.getRequirements);
router.delete("/delete-requirement", userCtrl.deleteRequirement);
router.post("/update-user", userCtrl.updateUser);
router.get("/get-connection-requests", userCtrl.getConnectionRequests);
router.get("/update-connection-requests", userCtrl.updateConnectionRequest);
router.get("/is-existing-request", userCtrl.isExistingRequest);
router.post("/send-email", sendEmailFunction);

export default router;
