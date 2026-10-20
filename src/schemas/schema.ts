import {z} from "zod";


const registerSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(72)
})

const loginSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().max(72).min(1)
})


export {registerSchema, loginSchema}