import { Router } from "express";
import { resendEmail, googleAuth, join } from "../controllers/auth.js";

const router = Router();

router.post("/join", join);
router.post("/google", googleAuth);
// router.post("/signin", signIn);
router.post("/resend-email", resendEmail);
router.post("/complete-profile", completeProfile)

export default router
