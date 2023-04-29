import express from "express";

import providerCtrl from "../controllers/provider.js";

const router = express.Router();

router.post("/register", providerCtrl.register);
router.post("/login", providerCtrl.login);
router.get("/fetch-security-ques", providerCtrl.fetchSecurityQues);
router.post("/match-security-ans", providerCtrl.matchSecurityAns);
router.post("/change-password", providerCtrl.changePassword);
router.get("/get-providers/:service", providerCtrl.getProviders);
router.get("/get-requirements", providerCtrl.getRequirements);

export default router;
