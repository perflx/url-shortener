import express, {type Request, type Response} from 'express';
import {config} from "../src/shared/config";
import authRoutes from "./auth/auth.routes";
import jwt from 'jsonwebtoken';


const app = express();
app.use(express.json());


app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

app.use((req: Request, res: Response, next) => {
  try{
    if (typeof req.headers.authorization !== "string"){ res.send(401).json({success: false, message: "No token"}); return};
    const auth = req.headers.authorization
    if (typeof auth !== "string") { res.send(401).json({success: false, message: "No token"}); return};
    const [bearer, token] = auth.split(" ");
    if (!token){throw new Error};
    try{
      const result = jwt.verify(token, config.jwtsecret)
      console.log(jwt);
      next();
    }catch(error){
      res.send(401).json({success: false, message: "Unathorized"});
    }
    
  }catch(error){

    res.send(401).json({success: false, message: "Token expired"});
  }
});


app.get('/test', (req: Request, res: Response) => {
    res.send({express: 'lalalal'});
});

app.use("/auth", authRoutes);


app.listen(config.port, () => console.log(`Listening on http://localhost:${config.port}`));
