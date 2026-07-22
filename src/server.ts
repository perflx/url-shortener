import express, {type Request, type Response} from 'express';
import {config} from "../src/shared/config";

const app = express();
app.use(express.json());



app.get('/test', (req: Request, res: Response) => {
    res.send({express: 'lalalal'});
});

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
