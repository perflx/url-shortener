import {createUser, loginUser, getUser, userLinks, getUserById} from "./auth.service";
import {ExistingUserError, InvalidCredentialsError, BadRequestError, UserNotFoundError} from '../shared/errors';
import { Request, Response } from 'express';

export { registerController, loginController, userDataController, userLinksController }

async function registerController(req: Request, res: Response){
    try{
        const {email, password} = req.body;
        await createUser(email, password);
        res.json({success: true});
    } catch (error){
        console.error(error);
        if (error instanceof ExistingUserError){
            res.status(409).json({success: false, message: "The user already exists"});
        }
        res.status(500).json({success: false, message: "Internal Server Error"});
    } 
}

async function userDataController(req: Request, res: Response){
    try{
        const id = req.body.id;
        console.log(`id: ${id}`);
        if (typeof id !== "number"){
            res.status(401).json({ success: false, message: "ID is not valid" });
            return;    
        };
        const user = await getUserById(id);
        const result = {id: user?.id, email: user?.email, createdAt: (user?.createdAt)?.toLocaleDateString("en-GB")};
        res.status(200).json(result);
    }catch(error){
        if(error instanceof UserNotFoundError) res.status(404).json({success: false, message: "The User was not found"});
        res.status(500).json({success: false, message: "Internal Server Error"})
        console.error(error);
    }
}

async function loginController(req: Request, res: Response){
    try{
        const {email, password} = req.body;
        if (typeof email !== "string" || typeof password !== "string"){throw new BadRequestError};
        const result = await loginUser(email, password);
        res.json({token: result});
    } catch(error){
        if(error instanceof InvalidCredentialsError) res.status(401).json({success: false, message: "Invalid login or password"});
        if(error instanceof BadRequestError) res.status(400).json({success: false, message: "Invalid login or password"});
        res.status(500).json({success: false, message: "Internal server error"})
    }
}

async function userLinksController(req: Request, res: Response){
    try{
        const email = req.params.email;
        if (typeof email !== "string"){
            res.status(401).json({ success: false, message: "Email address is not valid" });
            return;    
        };
        const links = await userLinks(email);
        res.status(200).json({links: links});
    }catch(error){
        if(error instanceof UserNotFoundError) res.status(404).json({success: false, message: "The User was not found"});
        res.status(500).json({success: false, message: "Internal server error"});
    }
}