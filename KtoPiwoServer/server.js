import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory list (resets when server restarts)
const strings = ["hello", "world"];

app.get("/strings", (req, res) => {
  res.json(strings);
});

app.post("/strings", (req, res) => {
  const { value } = req.body;
  if (!value || typeof value !== "string") {
    return res.status(400).json({ error: "value must be a string" });
  }
  console.log(`Gotten string ${value}`)
  strings.push(value);
  res.json({ ok: true, strings });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
