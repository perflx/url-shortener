import app from './app';
import {config} from "../src/shared/config";

app.listen(config.port, () => console.log(`Listening on http://localhost:${config.port}`));
