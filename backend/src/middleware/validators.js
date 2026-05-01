import { body, param, query } from "express-validator";

const objectIdMessage = "Invalid identifier format";

export const signupValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage("Password must include uppercase, lowercase, and a number"),
  body("role").optional().isIn(["Admin", "Member"]).withMessage("Role must be Admin or Member"),
];

export const loginValidation = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const projectValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("teamMembers").optional().isArray().withMessage("Team members must be an array"),
  body("teamMembers.*").optional().isMongoId().withMessage(objectIdMessage),
];

export const projectMembersValidation = [
  body("teamMembers").isArray({ min: 1 }).withMessage("Provide at least one team member"),
  body("teamMembers.*").isMongoId().withMessage(objectIdMessage),
];

export const taskCreateValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("projectId").isMongoId().withMessage("Valid project is required"),
  body("assignedTo").isMongoId().withMessage("Valid assignee is required"),
  body("status").optional().isIn(["Todo", "In Progress", "Done"]).withMessage("Invalid status"),
  body("priority").optional().isIn(["Low", "Medium", "High"]).withMessage("Invalid priority"),
  body("dueDate").notEmpty().withMessage("Due date is required").isISO8601().withMessage("Due date must be a valid date"),
];

export const taskUpdateValidation = [
  param("id").isMongoId().withMessage(objectIdMessage),
  body("status").optional().isIn(["Todo", "In Progress", "Done"]).withMessage("Invalid status"),
  body("priority").optional().isIn(["Low", "Medium", "High"]).withMessage("Invalid priority"),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
  body("assignedTo").optional().isMongoId().withMessage("Valid assignee is required"),
  body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
];

export const mongoIdParamValidation = [
  param("id").isMongoId().withMessage(objectIdMessage),
];

export const taskQueryValidation = [
  query("projectId").optional({ checkFalsy: true }).isMongoId().withMessage("Project filter must be valid"),
  query("status").optional({ checkFalsy: true }).isIn(["Todo", "In Progress", "Done"]).withMessage("Invalid status filter"),
  query("priority").optional({ checkFalsy: true }).isIn(["Low", "Medium", "High"]).withMessage("Invalid priority filter"),
  query("search").optional({ checkFalsy: true }).isString().withMessage("Search must be a string"),
  query("sortBy").optional({ checkFalsy: true }).isIn(["dueDate", "priority", "createdAt"]).withMessage("Invalid sort field"),
  query("sortOrder").optional({ checkFalsy: true }).isIn(["asc", "desc"]).withMessage("Invalid sort order"),
  query("assignedTo").optional({ checkFalsy: true }).isMongoId().withMessage("Assignee filter must be valid"),
  query("page").optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage("Page must be at least 1"),
  query("limit").optional({ checkFalsy: true }).isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];
