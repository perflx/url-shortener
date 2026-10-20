import express, {NextFunction, type Request, type Response} from 'express';
import {config} from "./shared/config";
import authRoutes from "./auth/auth.routes";
import linkRoutes from "./links/links.routes";
import redirectRoutes from "./redirect/redirect.router";
import {authMiddleware} from "./auth/authMiddleware";
import {userDataController} from "./auth/auth.controller";
import { AppError } from './shared/errors';
import {authLimiter } from "./links/linksMiddleware";

const app = express();
app.use(express.json());


app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

app.use((req, res, next) =>{
  if (!config.jwtsecret){
    res.status(404).json({success: false, message: "JWT is not specified"});
    return;
  }
  next();
});



app.get("/me", authMiddleware, userDataController);
app.use("/auth", authLimiter, authRoutes);
app.use("/links", linkRoutes);
app.use("", redirectRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if(res.headersSent){next(err)}
  if (err instanceof AppError){
    res.status(err.statusCode).json({message: err.message});
    return;
  }
  console.error(err);
  res.status(500).send("Internal Server Error");
  return;
});

export default app;