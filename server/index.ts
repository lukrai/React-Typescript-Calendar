import * as path from "path";
const envPath = __dirname.endsWith("server")
    ? path.join(__dirname, "..", ".env")
    : path.join(__dirname, "..", "..", ".env");
require("dotenv").config({ path: envPath });
import App from "./app";

const app = new App();

app.listen();
