import express from "express";
import { getUsers, addMember, removeMember } from "../controllers/userController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("Admin"), getUsers);
router.post("/", protect, authorize("Admin"), addMember);
router.delete("/:id", protect, authorize("Admin"), removeMember);

export default router;

