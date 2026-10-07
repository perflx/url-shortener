import express, {type Request, type Response} from 'express';
import {config} from "../../src/shared/config";
import { registerController, loginController, userDataController, UserLinksController } from "./auth.controller";

const router = express.Router();

router.post("/", registerController);
router.get("/:email", userDataController);
router.get("/links/:email", UserLinksController);

export default router;