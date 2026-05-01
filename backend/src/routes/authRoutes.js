import express from "express";
import { login, signup } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { loginValidation, signupValidation } from "../middleware/validators.js";

const router = express.Router();

router.post("/signup", signupValidation, validateRequest, signup);
router.post("/login", loginValidation, validateRequest, login);

export default router;

