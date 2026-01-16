const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TTS backend running 🚀");
});

app.post("/api/log", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text missing" });
  }

  console.log("User text:", text);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
