import { Router } from "express";
import { createExpense, getAllExpenses, getExpenseByFilter, deleteExpense, updateExpense, totalExpense, categoryWiseExpense, monthlyExpenseReport, calculateMaxExpense } from "../controllers/expense.js";

const router = Router();

router.post("/expense", createExpense);
router.get("/expense", getAllExpenses);
router.get("/expense/filter", getExpenseByFilter);
router.put("/expense/:id", updateExpense);
router.delete("/expense/:id", deleteExpense);
router.get("/expense/total/:userId", totalExpense);
router.get("/expense/category/:userId", categoryWiseExpense);
router.get("/expense/monthly/:userId", monthlyExpenseReport);
router.get("/expense/max/:userId", calculateMaxExpense);

export default router;
