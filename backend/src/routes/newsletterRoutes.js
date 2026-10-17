import { Router } from "express";
import { body } from "express-validator";
import { subscribeNewsletter } from "../controllers/newsletterController.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.post(
  "/subscribe",
  [body("email").trim().isEmail().withMessage("A valid email address is required")],
  validateRequest,
  subscribeNewsletter,
);

export default router;
