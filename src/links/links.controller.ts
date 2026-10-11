import {createLink, userLinks} from "./links.service";
import {Request, Response } from "express";
import {InvalidURLError, InvalidTokenError, LongLinkError, UserNotFoundError} from "../shared/errors";
import { config } from "../shared/config";

export async function createLinkController(req: Request, res: Response){
    try{
    const [id, link] = [req.body.id, req.body.link];
    if (typeof link !== "string"){throw new InvalidURLError}
    if (typeof id !== "number"){throw new InvalidTokenError}; 
    const short = await createLink(id, link);
    res.status(201).json({success: true, id: id, originalURL: link, shortURL: config.url + short});
    }catch(error){
        if(error instanceof InvalidURLError || error instanceof LongLinkError || error instanceof LongLinkError){
            res.status(400).json({success: false, message: error.message});
            return;
        }
        if(error instanceof InvalidTokenError){
            res.status(401).json({success: false, message: error.message});
            return;
        }
        res.status(500).json({success: false, message: "Internal Server Error"});
        return;
    }
}

export async function userLinksController(req: Request, res: Response){
    try{
        const id = req.body.id;
        if (typeof id !== "number"){
            res.status(401).json({ success: false, message: "ID is not valid" });
            return;    
        };
        const links = await userLinks(id);
        res.status(200).json({links: links});
    }catch(error){
        if(error instanceof UserNotFoundError) res.status(404).json({success: false, message: "The User was not found"});
        res.status(500).json({success: false, message: "Internal server error"});
    }
}