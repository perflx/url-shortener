import { create } from 'node:domain';
import {createUser, loginUser, getUser, userLinks} from '../auth/auth.service';
import { Request, Response } from 'express';

export { registerController, loginController, userDataController, UserLinksController }

async function registerController(req: Request, res: Response){
    try{
        const {email, password} = req.body;
        try{
            const result = await createUser(email, password);
            res.json({success: result});
        }catch(error){
            res.status(404).json({success: false, message: "The user already exists"});
        }
    } catch (error){
        console.error(error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

async function userDataController(req: Request, res: Response){
    try{
        const email = req.params.email;
        if (typeof email !== "string"){
            res.status(400).json({ success: false, message: "email address is not valid" });
            return;    
        };
        const user = await getUser(email);
        const result = {id: user?.id, email: user?.email, createdAt: (user?.createdAt)?.toLocaleDateString("en-GB")};
        res.status(200).json(result);
    }catch(error){
        res.status(404).json({success: false, message: "The user doesn't exist"})
        console.error(error);
    }
}

async function loginController(req: Request, res: Response){
    try{
        const {email, password} = req.body;
        if (typeof email !== "string"){throw new Error("Email is obligatory!")}
        if (typeof password !== "string") throw new Error("Password must be presented!");
        const result = await loginUser(email, password);
        
        res.json({success: result});
    } catch(error){
        

        res.status(500).json({success: false, message: "Internal server error"})
    }
}

async function UserLinksController(req: Request, res: Response){
    try{
        const email = req.params.email;
        if (typeof email !== "string"){
            res.status(400).json({ success: false, message: "email address is not valid" });
            return;    
        };
        const links = await userLinks(email);
        res.status(200).json({links: links});
    }catch(error){
        res.status(500).json({success: false, message: "Internal server error"});
    }
}