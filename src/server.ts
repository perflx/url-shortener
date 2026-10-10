import express, {type Request, type Response} from 'express';
import {config} from "../src/shared/config";
import authRoutes from "./auth/auth.routes";
import jwt from 'jsonwebtoken';
import {authMiddleware} from "../src/auth/authMiddleware";
import {userDataController} from "./auth/auth.controller";

const app = express();
app.use(express.json());


app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

app.use((req, res, next) =>{
  if (!config.jwtsecret){
    res.status(404).json({success: false, message: "JWT is not specified"});
  }
  next();
});


app.get('/test', (req: Request, res: Response) => {
    res.send({express: 'lalalal'});
});

app.get('/test/token', authMiddleware, (req: Request, res: Response) => {
  res.send({token: true, id: req.body.id});
})

app.get("/me", authMiddleware, userDataController);
app.use("/auth", authRoutes);


app.listen(config.port, () => console.log(`Listening on http://localhost:${config.port}`));
