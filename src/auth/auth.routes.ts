import express from 'express';
import { registerController, loginController, userDataController} from "./auth.controller";
import {authMiddleware} from "./authMiddleware";

const router = express.Router();


router.post("/register", registerController);
router.post("/login", loginController);

export default router;