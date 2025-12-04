import express from "express"
import { borrowBook, confirmReturn, getAllBorrow, requestReturn } from "../controllers/borrowController.js"
import { isAdmin, verifyToken } from "../middleware/middleware.js"
import { borrowBookRules, returnBookRules, validate } from "../validators/borrowValidator.js"

const route = express.Router()

route.post("/:bookId", verifyToken, borrowBookRules, validate, borrowBook);
route.post("/request-return/:borrowId", verifyToken, returnBookRules, validate, requestReturn)
route.post("/confirm-return/:borrowId", verifyToken, isAdmin, returnBookRules, validate, confirmReturn)
route.get("/", verifyToken, isAdmin, getAllBorrow)

export default route