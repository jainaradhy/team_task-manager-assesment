import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProjectMembers,
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  mongoIdParamValidation,
  projectMembersValidation,
  projectValidation,
} from "../middleware/validators.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorize("Admin"), projectValidation, validateRequest, createProject)
  .get(getProjects);

router
  .route("/:id")
  .get(mongoIdParamValidation, validateRequest, getProjectById)
  .delete(authorize("Admin"), mongoIdParamValidation, validateRequest, deleteProject);

router.patch(
  "/:id/members",
  authorize("Admin"),
  mongoIdParamValidation,
  projectMembersValidation,
  validateRequest,
  updateProjectMembers
);

export default router;

