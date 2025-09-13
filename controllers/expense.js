import { Types } from "mongoose";
import { Expenses } from "../models/expense.js";
import req from "express/lib/request.js";

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
    const expenses = await Expenses.find().lean()

    return res
      .status(201)
      .json({ success: false, message: "Success", expenses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getExpenseByFilter = async (req, res) => {
  try {
    const { userId, title, category, date, note, id } = req.query;

    let filter = {};

    if (id) {
      filter._id = id;
    }

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

    const expenses = await Expenses.find(filter)  

    return res
      .status(200)
      .json({ success: false, message: "Success", expenses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const data = req.body;

    const { id } = req.params;

    const isExpenseExists = await Expenses.findById(id);
    if (!isExpenseExists) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not exists" });
    }

    await Expenses.updateOne({ _id: id }, { $set: data });

    const updatedExpense = await Expenses.findOne({ _id: id })

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

export const totalExpense = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User Id is required" });
  }

  const expensesSummary = await Expenses.aggregate([
    {
      $match: { userId: new Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: "$userId",
        totalAmount: { $sum: "$amount" },
        totalExpense: { $count: {} }
      }
    }
  ])

  return res
    .status(200)
    .json({ success: true, message: "Success", expensesSummary });

}

export const categoryWiseExpense = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User Id is required" });
  }

  const categoryWise = await Expenses.aggregate([
    {
      $match: { userId: new Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: "$category",
        totalSpent: { $sum: "$amount" },
        averageSpent: { $avg: "$amount" },
        count: { $count: {} }
      }
    },
    { $sort: { totalSpent: -1 } }
  ])

  return res
    .status(200)
    .json({ success: true, message: "Success", categoryWise });
}

export const monthlyExpenseReport = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User Id is required" });
  }

  const monthReport = await Expenses.aggregate([
    {
      $match: { userId: new Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        totalSpent: { $sum: "$amount" },
        count: { $count: {} }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }
  ])

  return res
    .status(200)
    .json({ success: true, message: "Success", monthReport });
}

export const calculateMaxExpense = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User Id is required" });
  }

  const maxExpense = await Expenses.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
    { $sort: { amount: -1 } },
    { $limit: 1 }
  ])

  return res
    .status(200)
    .json({ success: true, message: "Success", maxExpense });
}