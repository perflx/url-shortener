import prisma from "../shared/prisma";
import {User} from "../../src/generated/prisma";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {config} from '../shared/config';


const jwtsecret = config.jwtsecret;
if (!jwtsecret) throw new Error('JWT_SECRET is not defined in .env');


async function isNewUser(email: string): Promise<boolean>{
    const user: User | null = await prisma.user.findUnique({
        where: {email: email}});
    return user === null;
}


export async function createUser(email: string, password: string){
    if (!await isNewUser(email)){
        throw new Error("The user already exists");
    }
    const crypted = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {email: email,  password: crypted}
    });
}

export async function loginUser(email: string, passwordPlain: string){
    const user = await prisma.user.findUnique({
        where: {email: email}
    });
    if (!user){
        throw new Error(`The user doesn't exist`);
    }
    const isMatching = await bcrypt.compare(passwordPlain, user.password);

    if (!isMatching){
        throw new Error('Wrong Email or password');
    }
    const token = jwt.sign({userId: user.id}, jwtsecret!, {expiresIn: '24h'});
    return token;
}

export async function getUser(email: string){
    if (await isNewUser(email)){
        throw new Error("The user doesn't exists")
    }
    const user: User | null = await prisma.user.findFirst({where: {email: email}});
    return user;
}