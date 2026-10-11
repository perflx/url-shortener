import express from "express";
import {createLinkController, userLinksController } from "./links.controller";
import { authMiddleware } from "../auth/authMiddleware";

const router = express.Router();

router.post("", authMiddleware, createLinkController);
router.get("", authMiddleware, userLinksController );


export default router;
