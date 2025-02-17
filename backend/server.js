import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import jokesRouter from "./routes/newJokes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/joke", jokesRouter);
app.use("/api/joke1", jokesRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


