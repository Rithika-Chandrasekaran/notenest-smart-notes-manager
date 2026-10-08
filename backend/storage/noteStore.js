const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

const dataDirectory = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDirectory, "notes.json");
let pendingOperation = Promise.resolve();

async function readNotes() {
  try {
    const contents = await fs.readFile(dataFile, "utf8");
    const notes = JSON.parse(contents);
    if (!Array.isArray(notes)) {
      throw new Error("The notes data file must contain a JSON array.");
    }
    return notes;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function withNotes(updateNotes) {
  const operation = pendingOperation.then(async () => {
    const notes = await readNotes();
    const result = await updateNotes(notes);
    if (result.changed) {
      await fs.mkdir(dataDirectory, { recursive: true });
      await fs.writeFile(dataFile, `${JSON.stringify(notes, null, 2)}\n`, "utf8");
    }
    return result.value;
  });

  pendingOperation = operation.then(() => undefined, () => undefined);
  return operation;
}

function listNotes() {
  return withNotes((notes) => ({
    value: notes.sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt)),
    changed: false,
  }));
}

function findNote(id) {
  return withNotes((notes) => ({
    value: notes.find((note) => note.id === id) || null,
    changed: false,
  }));
}

function createNote({ title, content, category }) {
  return withNotes((notes) => {
    const now = new Date().toISOString();
    const note = {
      id: randomUUID(),
      title: title.trim(),
      content: content.trim(),
      category: typeof category === "string" && category.trim() ? category.trim() : "General",
      createdAt: now,
      updatedAt: now,
    };
    notes.push(note);
    return { value: note, changed: true };
  });
}

function updateNote(id, { title, content, category }) {
  return withNotes((notes) => {
    const note = notes.find((item) => item.id === id);
    if (!note) {
      return { value: null, changed: false };
    }
    note.title = title.trim();
    note.content = content.trim();
    note.category = typeof category === "string" && category.trim() ? category.trim() : "General";
    note.updatedAt = new Date().toISOString();
    return { value: note, changed: true };
  });
}

function deleteNote(id) {
  return withNotes((notes) => {
    const noteIndex = notes.findIndex((item) => item.id === id);
    if (noteIndex === -1) {
      return { value: false, changed: false };
    }
    notes.splice(noteIndex, 1);
    return { value: true, changed: true };
  });
}

module.exports = { listNotes, findNote, createNote, updateNote, deleteNote };
