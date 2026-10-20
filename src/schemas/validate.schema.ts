import {z} from "zod";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../shared/errors";

export function validate(schema: z.ZodObject){
    return (req: Request, res: Response, next: NextFunction) => {
        const schemaData = schema.safeParse(req.body);
        if (!schemaData.success){throw new BadRequestError(z.prettifyError(schemaData.error))};
        req.body = schemaData.data;
        next()
    }
}