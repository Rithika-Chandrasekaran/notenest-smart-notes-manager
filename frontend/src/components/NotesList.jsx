import NoteCard from "./NoteCard.jsx";

function NotesList({ notes, loading, searchTerm, onEdit, onDelete }) {
  if (loading) {
    return <p className="list-message" role="status">Gathering your notes...</p>;
  }

  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon" aria-hidden="true">✳</div>
        <h3>{searchTerm ? "No notes match your search." : "No notes yet. Create your first note!"}</h3>
        <p>{searchTerm ? "Try another title, topic, or category." : "Your thoughts will feel right at home here."}</p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default NotesList;
