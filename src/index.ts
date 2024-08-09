import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import cors from "cors";
import router from "./routes";

const app = express();

app.use(cors());

app.use(express.json());

connectDB();

app.get("/health-check", (req: Request, res: Response) => {
  res.send("Health check successful!");
});

app.use("/api/v1", router);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} 🚀`);
});
