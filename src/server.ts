import express, {type Request, type Response} from 'express';
import {config} from "../src/shared/config";
import authRoutes from "./auth/auth.routes";
import linkRoutes from "./links/links.routes";
import redirectRoutes from "./redirect/redirect.router";
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
    return;
  }
  next();
});

app.use((error, req, res, next) => {
  
  next();
});



app.get("/me", authMiddleware, userDataController);
app.use("/auth", authRoutes);
app.use("/links", linkRoutes);
app.use("", redirectRoutes);

app.listen(config.port, () => console.log(`Listening on http://localhost:${config.port}`));
