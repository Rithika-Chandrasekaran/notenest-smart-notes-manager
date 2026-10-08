import { useCallback, useEffect, useState } from "react";
import NoteForm from "./components/NoteForm.jsx";
import NotesList from "./components/NotesList.jsx";

const API_URL = "http://localhost:5000/api/notes";
const initialForm = { title: "", content: "", category: "General" };

async function readResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed.");
  }
  return data;
}

function requestErrorMessage(error, fallback) {
  return error instanceof TypeError ? fallback : error.message || fallback;
}

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchNotes = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await readResponse(await fetch(API_URL));
      setNotes(data.notes);
      setError("");
    } catch (requestError) {
      setError(requestErrorMessage(requestError, "Could not connect to NoteNest. Check that the API is running."));
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (!success) return undefined;
    const timeout = window.setTimeout(() => setSuccess(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [success]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleEdit(note) {
    setEditingNote(note);
    setForm({ title: note.title, content: note.content, category: note.category || "General" });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingNote(null);
    setForm(initialForm);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Please enter both a title and note content.");
      return;
    }

    setIsSaving(true);
    setError("");
    const isEditing = Boolean(editingNote);
    try {
      const response = await fetch(isEditing ? `${API_URL}/${editingNote.id}` : API_URL, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          category: form.category,
        }),
      });
      await readResponse(response);
      setForm(initialForm);
      setEditingNote(null);
      setSuccess(isEditing ? "Note updated successfully." : "Note added successfully.");
      await fetchNotes(false);
    } catch (requestError) {
      setError(requestErrorMessage(requestError, "Could not save your note. Please try again."));
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteNote(note) {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setError("");
    setSuccess("");
    try {
      await readResponse(await fetch(`${API_URL}/${note.id}`, { method: "DELETE" }));
      if (editingNote?.id === note.id) handleCancelEdit();
      setSuccess("Note deleted successfully.");
      await fetchNotes(false);
    } catch (requestError) {
      setSuccess("");
      setError(requestErrorMessage(requestError, "Could not delete this note. Please try again."));
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredNotes = notes.filter((note) =>
    [note.title, note.content, note.category]
      .some((value) => value?.toLowerCase().includes(normalizedSearch))
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="NoteNest home">
          <span className="brand-icon" aria-hidden="true">n</span>
          <span>NoteNest</span>
        </a>
        <span className="header-caption">YOUR THOUGHTS, IN GOOD COMPANY</span>
      </header>

      <main className="main-content">
        <section className="welcome">
          <div className="welcome-copy">
            <p className="eyebrow">A LITTLE SPACE TO THINK</p>
            <h1>Make room for<br /><span>what matters.</span></h1>
            <p className="welcome-subtitle">Organize your thoughts, one note at a time.</p>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <span className="art-spark">✳</span>
            <div className="art-note art-note-back" />
            <div className="art-note art-note-front"><i /><i /><i /></div>
            <span className="art-dot" />
          </div>
        </section>

        {success && (
          <div className="notice notice-success" role="status" aria-live="polite">
            <span className="success-icon" aria-hidden="true">✓</span>
            {success}
          </div>
        )}
        {error && <div className="notice notice-error" role="alert">{error}</div>}

        <NoteForm
          title={form.title}
          content={form.content}
          category={form.category}
          isEditing={Boolean(editingNote)}
          isSaving={isSaving}
          onTitleChange={(value) => updateForm("title", value)}
          onContentChange={(value) => updateForm("content", value)}
          onCategoryChange={(value) => updateForm("category", value)}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />

        <section className="notes-section" aria-labelledby="notes-title">
          <div className="notes-heading">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h2 id="notes-title">All notes <span className="note-count">{notes.length}</span></h2>
            </div>
            <label className="search-box">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search your notes..."
                aria-label="Search notes by title, content, or category"
              />
            </label>
          </div>
          <NotesList
            notes={filteredNotes}
            loading={loading}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={deleteNote}
          />
        </section>
      </main>

      <footer className="site-footer">A calm corner for all the things on your mind <span>✳</span></footer>
    </div>
  );
}

export default App;
