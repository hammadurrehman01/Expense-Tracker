import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import authRoute from "./routes/auth.js"
import expenseRoute from "./routes/expense.js"
import cors from "cors"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // allow cookies / Authorization headers
  })
);

app.use(express.json());
app.use("/api/auth", authRoute)
app.use("/api", expenseRoute)

connectDB();
app.listen(PORT, () => {
  console.log(`Server is listening to the port ${PORT}`);
});


// {
//  "verbose": true,
//  "watch": ["src/**/*.js"],
//  "exec": "./src/index.js",
//  "pollingInterval": 100,
//  "legacyWatch": true
// }