import {getOriginalLink, incrementCount} from "./redirect.service";
import { Request, Response } from "express";
import {InvalidURLError, NotExistingURLError} from "../shared/errors";

export async function redirectController(req: Request, res: Response){
    try{
    const shortCode = req.params.shortCode;
    if (typeof shortCode !== "string"){throw new InvalidURLError}
    const originalURL = await getOriginalLink(shortCode);
    await incrementCount(shortCode);
    res.status(302).redirect(originalURL);
    return;
    }catch(error){
        if (error instanceof InvalidURLError){
            res.status(400).json({success: false, message: error.message});
            return;
        }
        if (error instanceof NotExistingURLError){
            res.status(404).send("Error 404: The URL was not found");
            return;
        }
        res.status(500).json({success: false, message: "Internal Server Error"})
        return;
    }


}
