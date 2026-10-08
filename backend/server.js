require("dotenv").config();

const express = require("express");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/notes", noteRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }

  console.error("Notes API error:", error);
  return res.status(500).json({ message: "Something went wrong. Please try again." });
});

app.listen(port, () => {
  console.log(`Notes API server running on port ${port}`);
  console.log("Notes are stored locally in backend/data/notes.json");
});
