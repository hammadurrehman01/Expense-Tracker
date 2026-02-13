import { Router } from "express";
import { signUp, signIn, resendEmail, googleSignup } from "../controllers/auth.js";

const router = Router();

router.post("/signup", signUp);
router.post("/google/signup", googleSignup);
router.post("/signin", signIn);
router.post("/resend-email", resendEmail);

export default router
