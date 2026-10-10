import express, {type Request, type Response} from 'express';
import { registerController, loginController, userDataController, userLinksController } from "./auth.controller";
import {authMiddleware} from "./authMiddleware";

const router = express.Router();


router.post("/register", registerController);
router.get("/:email", userDataController);
router.get("/me", userDataController);
router.get("/links/:email", userLinksController);
router.post("/login", loginController);

export default router;