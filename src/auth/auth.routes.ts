import express, {type Request, type Response} from 'express';
import { registerController, loginController, userDataController, userLinksController } from "./auth.controller";

const router = express.Router();


router.post("/register", registerController);
router.get("/:email", userDataController);
router.get("/links/:email", userLinksController);
router.post("/login", loginController);

export default router;