import express from 'express';
import { registerController, loginController, userDataController} from "./auth.controller";
import { validate } from '../schemas/validate.schema';
import { registerSchema, loginSchema } from '../schemas/schema';

const router = express.Router();


router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);

export default router;