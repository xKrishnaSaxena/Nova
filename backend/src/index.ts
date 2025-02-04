import express from "express";
import config from "./utils/config";
import mongoose from "mongoose";
import cors from "cors";
const PORT = config.PORT;
const MONGO_URI = config.MONGO_URI;

mongoose.connect(MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ message: "Hii , from Nova Backend!!" });
});
app.use("/api/auth", require("./routers/authRouter").default);
app.use("/api/deposit", require("./routers/depositRouter").default);
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
