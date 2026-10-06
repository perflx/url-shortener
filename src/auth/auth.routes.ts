import express, {type Request, type Response} from 'express';
import {config} from "../../src/shared/config";
import { registerController, loginController, getUserData } from "./auth.controller";
import { getUser } from './auth.service';

const router = express.Router();

router.post("/", registerController);
router.get("/", getUserData);


export default router;