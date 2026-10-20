import prisma from "../shared/prisma";
import {InvalidURLError, LongLinkError, UserNotFoundError, TooManyLinksError} from "../shared/errors";
import { nanoid } from "nanoid";

export function normalizeLink(link:string): URL{
    if (link.length > 2048){
        throw new LongLinkError;
    }
    let processedInput = link.trim();
     if (processedInput.includes(" ")) {
        throw new InvalidURLError;
  }
    const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(processedInput);
    if (!hasProtocol){
        processedInput = "https://" + processedInput;
    }
    try{
        const url = new URL(processedInput);
        if (url.protocol === "http:" || url.protocol === "https:"){
            return url;
        }
        throw new InvalidURLError;
    }catch(error){
        throw new InvalidURLError;
    }

}

export async function isNewLink(link: string): Promise<boolean>{
    const shortCode = await prisma.link.findUnique({where: {shortCode: link}});
    return shortCode === null;
} 

async function linksCreatedLastDay(id: number){
    const time = new Date(new Date().getTime() - (24 * 60  * 60 * 1000));
    const links = await prisma.link.count({where: {authorId: id, createdAt: {gt: time}}});
    return links;
}

export async function createLink(id: number, link: string){
    if (await linksCreatedLastDay(id) >= 10){
        throw new TooManyLinksError;
    }
    const normalizedLink = normalizeLink(link);
    let short: string;
    do{
        short = nanoid(8);
    }while (!await isNewLink(short));

    await prisma.link.create({data: {shortCode: short, originalUrl: normalizedLink.href, authorId: id}});
    return short;
}


export async function userLinks(id: number){
    const user = await prisma.user.findUnique({where: {id: id},
                                                            include:{links: true},});
    if (!user) throw new UserNotFoundError;
    return user.links;
}