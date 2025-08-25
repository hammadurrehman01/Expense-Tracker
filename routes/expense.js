import { Router } from "express";
import { createExpense, getAllExpenses, getExpenseByFilter, deleteExpense, updateExpense } from "../controllers/expense.js";

const router = Router();

router.post("/expense", createExpense);
router.get("/expense", getAllExpenses);
router.get("/expense/filter", getExpenseByFilter);
router.put("/expense/:id", updateExpense);
router.delete("/expense/:id", deleteExpense);

export default router;
