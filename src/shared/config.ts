import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    jwtsecret: process.env.JWT_SECRET ?? (() => {throw new Error('JWTSECRET is not present')})()

}
