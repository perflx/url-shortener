import { create } from 'node:domain';
import {createUser, loginUser} from '../auth/auth.service';
import { Request, Response } from 'express';

export { registerController, loginController }

async function registerController(req: Request, res: Response){
    try{
        const {email, password} = req.body;
        const result = await createUser(email, password);
        res.json({success: result});
    } catch (error){
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

async function loginController(req: Request, res: Response){
    try{
        const {email, password} = req.body;
        const result = await loginUser(email, password);
        res.json({success: result});
    } catch(error){
        res.status(500).json({success: false, message: "Internal server error"})
    }
}
