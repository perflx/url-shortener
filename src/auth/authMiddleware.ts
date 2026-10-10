import {InvalidTokenError} from "../shared/errors";
import jwt from "jsonwebtoken";
import {config} from "../../src/shared/config";
import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction){
  try{
    if (typeof req.headers.authorization !== "string"){ res.status(401).json({success: false, message: "No token"}); return};
    const auth = req.headers.authorization;
    console.log(`Auth: ${auth}`);
    const [bearer, token] = auth.split(" ");
    if (!token || bearer !== "Bearer"){throw new InvalidTokenError};
    const result = jwt.verify(token, config.jwtsecret);
    if (typeof result !== "string"){
      console.log(`userId: ${result.userId}`)
      req.body = {...req.body, id: result.userId};
    }else{
      throw new Error;
    }
    
  }catch(error){
    if (error instanceof InvalidTokenError){res.status(401).json({success: false, message: "Invalid token"}); return;}

    res.status(401).json({success: false, message: "Token expired"});
    return;
  }
  next();
};