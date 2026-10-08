function NoteCard({ note, onEdit, onDelete }) {
  const createdDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="note-card">
      <div className="note-card-top">
        <span className="category-tag">{note.category || "General"}</span>
        <span className="note-date">{createdDate}</span>
      </div>
      <h3>{note.title}</h3>
      <p className="note-content">{note.content}</p>
      <div className="note-actions">
        <button className="text-button" type="button" onClick={() => onEdit(note)}>
          <span aria-hidden="true">↗</span> Edit
        </button>
        <button className="text-button delete-button" type="button" onClick={() => onDelete(note)}>
          <span aria-hidden="true">×</span> Delete
        </button>
      </div>
    </article>
  );
}

export default NoteCard;
