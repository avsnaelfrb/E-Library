import "dotenv/config";
import express from "express";
import mainRoute from "./src/routes/mainRoute.js";
import cors from "cors";
import errorHandler from "./src/middleware/errorHandler.js";
import { validateEnv } from "./src/config/envValidator.js";

validateEnv();

const corsOp = {
  origin: process.env.CORS_ALLOW.split(","),
  optionsSuccessStatus: 200,
};
const app = express();

app.use(cors(corsOp));
app.use(express.json());
app.use(express.static("public"));
app.use("/api", mainRoute);
app.use(errorHandler);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server berjalan di http://localhost:${port}`);
});

export default app;
// if (process.env.NODE_ENV !== 'test') {
// }
