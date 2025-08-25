import { Expenses } from "../models/expense.js";

export const createExpense = async (req, res) => {
  try {
    const { userId, title, amount, category, date, note } = req.body;

    if (!userId && !title && !amount)
      return res.json({ success: false, message: "data is required" });

    await Expenses.create({ userId, title, amount, category, date, note });

    return res
      .status(201)
      .json({ success: false, message: "Expense created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expenses.find();

    return res
      .status(201)
      .json({ success: false, message: "Success", expenses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getExpenseByFilter = async (req, res) => {
  try {
    const { userId, title, category, date, note } = req.query;

    let filter = {};

    if (userId) {
      filter.userId = userId;
    }

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (date) {
      filter.userId = new Date(date);
    }

    if (note) {
      filter.note = { $regex: note, $options: "i" };
    }

    const expenses = await Expenses.find(filter);

    return res
      .status(200)
      .json({ success: false, message: "Success", expenses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;

    const { id } = req.params;

    const isExpenseExists = await Expenses.findById(id);
    if (!isExpenseExists) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not exists" });
    }

    const updatedExpense = await Expenses.updateOne(
      { _id: id },
      { $set: req.body }
    );
    return res
      .status(200)
      .json({ success: false, message: "Expense updated successfully", data: updatedExpense });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const isExpenseExists = await Expenses.findById(id);
    if (!isExpenseExists) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not exists" });
    }

    await Expenses.deleteOne({ _id: id });
    return res
      .status(200)
      .json({ success: false, message: "Expense deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};
