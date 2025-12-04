import express from "express";
import { getAllReadLogs, logRead } from "../controllers/readLogController.js";
import { isAdmin, verifyToken } from "../middleware/middleware.js";
import { logReadRules, validate } from "../validators/readLogValidator.js";

const route = express.Router();

route.post("/reading/:bookId", verifyToken, logReadRules, validate, logRead);
route.get("/", verifyToken, isAdmin, getAllReadLogs);

export default route;
