import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  mongoIdParamValidation,
  taskCreateValidation,
  taskQueryValidation,
  taskUpdateValidation,
} from "../middleware/validators.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorize("Admin"), taskCreateValidation, validateRequest, createTask)
  .get(taskQueryValidation, validateRequest, getTasks);

router
  .route("/:id")
  .patch(taskUpdateValidation, validateRequest, updateTask)
  .delete(authorize("Admin"), mongoIdParamValidation, validateRequest, deleteTask);

export default router;

