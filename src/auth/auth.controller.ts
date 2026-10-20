import {createUser, loginUser, getUser, getUserById} from "./auth.service";
import { BadRequestError, InvalidTokenError} from '../shared/errors';
import { Request, Response } from 'express';

export { registerController, loginController, userDataController }

async function registerController(req: Request, res: Response){
        const {email, password} = req.body;
        await createUser(email, password);
        res.status(201).json({success: true});
}

async function userDataController(req: Request, res: Response){
    const id = req.body.id;
    if (typeof id !== "number"){throw new InvalidTokenError;}
    const user = await getUserById(id);
    const result = {id: user.id, email: user?.email, createdAt: (user?.createdAt)?.toLocaleDateString("en-GB")};
    res.status(200).json(result);
}


async function loginController(req: Request, res: Response){
    const {email, password} = req.body;
    if (typeof email !== "string" || typeof password !== "string"){throw new BadRequestError};
    const result = await loginUser(email, password);
    res.json({token: result});
}