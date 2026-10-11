import express from "express";
import {redirectController} from "./redirect.controller";

const router = express.Router();

router.get("/:shortCode", redirectController);

export default router;