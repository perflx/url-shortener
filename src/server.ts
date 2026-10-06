import express, {type Request, type Response} from 'express';
import {config} from "../src/shared/config";
import authRoutes from "./auth/auth.routes";

const app = express();
app.use(express.json());



app.get('/test', (req: Request, res: Response) => {
    res.send({express: 'lalalal'});
});

app.use("/user", authRoutes);


app.listen(config.port, () => console.log(`Listening on http://localhost:${config.port}`));
