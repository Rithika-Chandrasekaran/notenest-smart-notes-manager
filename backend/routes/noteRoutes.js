const express = require("express");
const noteStore = require("../storage/noteStore");

const router = express.Router();

function validateNoteInput(req, res) {
  const { title, content } = req.body || {};
  if (typeof title !== "string" || !title.trim()) {
    res.status(400).json({ message: "Please enter a title." });
    return false;
  }
  if (typeof content !== "string" || !content.trim()) {
    res.status(400).json({ message: "Please enter note content." });
    return false;
  }
  if (title.trim().length > 120) {
    res.status(400).json({ message: "Title cannot be longer than 120 characters." });
    return false;
  }
  return true;
}

router.get("/", async (req, res, next) => {
  try {
    const notes = await noteStore.listNotes();
    return res.json({ notes });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const note = await noteStore.findNote(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }
    return res.json({ note });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  if (!validateNoteInput(req, res)) {
    return;
  }
  try {
    const note = await noteStore.createNote(req.body);
    return res.status(201).json({ message: "Note created successfully.", note });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  if (!validateNoteInput(req, res)) {
    return;
  }
  try {
    const note = await noteStore.updateNote(req.params.id, req.body);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }
    return res.json({ message: "Note updated successfully.", note });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await noteStore.deleteNote(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Note not found." });
    }
    return res.json({ message: "Note deleted successfully." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
