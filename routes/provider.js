import express from "express";

import providerCtrl from "../controllers/provider.js";

const router = express.Router();

router.post("/register", providerCtrl.register);
router.post("/login", providerCtrl.login);
router.get("/fetch-security-ques", providerCtrl.fetchSecurityQues);
router.get("/match-security-ans", providerCtrl.matchSecurityAns);
router.get("/change-password", providerCtrl.changePassword);
router.get("/get-providers/:service", providerCtrl.getProviders);
router.get("/get-requirements", providerCtrl.getRequirements);
router.get("/get-connection-requests", providerCtrl.getConnectionRequests);
router.get("/is-request-sent", providerCtrl.isRequestSent);

export default router;
