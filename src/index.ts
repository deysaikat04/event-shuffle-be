import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
var cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} 🚀`);
});
