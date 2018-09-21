import "reflect-metadata";
import * as dotenv from "dotenv-safe";
import bootstrap from "./bootstrap";

dotenv.config();

const app = bootstrap();

app.listen(8080);
