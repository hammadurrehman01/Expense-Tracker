import { Router } from "express";
import { signUp, signIn, resendEmail } from "../controllers/auth.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/resend-email", resendEmail);

export default router
