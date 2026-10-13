import {getOriginalLink, incrementCount} from "./redirect.service";
import { Request, Response } from "express";
import {InvalidURLError} from "../shared/errors";

export async function redirectController(req: Request, res: Response){
    const shortCode = req.params.shortCode;
    if (typeof shortCode !== "string"){throw new InvalidURLError}
    const originalURL = await getOriginalLink(shortCode);
    await incrementCount(shortCode);
    res.status(302).redirect(originalURL);
}
