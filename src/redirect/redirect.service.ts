import prisma from "../shared/prisma";
import {Prisma} from "../generated/prisma";
import {InvalidURLError} from "../shared/errors";
import { NotExistingURLError } from "../shared/errors";

export async function getOriginalLink(shortCode: string){
    if (typeof shortCode !== "string"){throw new InvalidURLError;}
    const link = await prisma.link.findUnique({where: {shortCode: shortCode}});
    if (!link){throw new NotExistingURLError};
    const originalURL = link.originalUrl;
    return originalURL;
}


export async function incrementCount(shortCode: string){
    try{
    const updatedLink = await prisma.link.update({where: {shortCode: shortCode}, data: {clicks: {increment: 1}}});
    return updatedLink;
    }catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"){throw new NotExistingURLError}
        throw error;
    }
}
