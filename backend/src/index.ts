import express from "express";
const PORT = 3000; // O : env PORT
const app = express();
app.get("/", async (req, res) => {
  res.json({ message: "Hii , from Nova Backend!!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
