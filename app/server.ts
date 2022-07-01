import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();

app.use('/api/v1/images', express.static(`${process.env.ENV_IMAGE_DIRECTORY}`))
app.use(cors())

app.use(express.json());
app.use(routes);

app.listen(3333, () => "server running on port 3333");
