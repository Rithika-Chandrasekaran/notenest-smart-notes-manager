const categories = ["General", "Study", "Work", "Personal", "Ideas"];

function NoteForm({
  title,
  content,
  category,
  isEditing,
  isSaving,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="composer panel" aria-labelledby="composer-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{isEditing ? "REFINE AN IDEA" : "MAKE SPACE FOR AN IDEA"}</p>
          <h2 id="composer-title">{isEditing ? "Edit your note" : "Create a note"}</h2>
        </div>
        <span className="heading-mark" aria-hidden="true">✳</span>
      </div>

      <form className="note-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Give your note a title"
            maxLength={120}
            required
          />
        </label>

        <label className="field">
          <span>Content</span>
          <textarea
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            placeholder="Write down what’s on your mind..."
            rows={5}
            required
          />
        </label>

        <div className="form-bottom">
          <label className="field category-field">
            <span>Category</span>
            <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <div className="form-actions">
            {isEditing && (
              <button className="button button-quiet" type="button" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button className="button button-primary" type="submit" disabled={isSaving}>
              <span aria-hidden="true">{isEditing ? "↻" : "+"}</span>
              {isSaving ? "Saving..." : isEditing ? "Update Note" : "Add Note"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default NoteForm;
