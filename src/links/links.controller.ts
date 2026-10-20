import {createLink, userLinks} from "./links.service";
import {Request, Response } from "express";
import {InvalidURLError, InvalidTokenError, LongLinkError, UserNotFoundError} from "../shared/errors";
import { config } from "../shared/config";

export async function createLinkController(req: Request, res: Response){
    const [id, link] = [req.body.id, req.body.link];
    if (typeof link !== "string"){throw new InvalidURLError}
    if (typeof id !== "number"){throw new InvalidTokenError}; 
    const short = await createLink(id, link);
    res.status(201).json({success: true, id: id, originalURL: link, shortCode: short, shortURL: config.url + short});
}

export async function userLinksController(req: Request, res: Response){
    const id = req.body.id;
    if (typeof id !== "number"){ throw new InvalidTokenError};
    const links = await userLinks(id);
    res.status(200).json({links: links});
}