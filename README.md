# NoteNest – Smart Notes Manager

A beginner-friendly notes application built with React and Express. The frontend uses the Fetch API to communicate with a REST API. The backend stores notes in a local JSON file, so MongoDB installation, Atlas setup, and database credentials are not needed.

> **Lab requirement note:** This version does not use MongoDB or Mongoose. It uses JSON-file storage as a simple offline alternative. Use the MongoDB version if your experiment must specifically demonstrate MongoDB and Mongoose.

## Prerequisites

- Node.js and npm

## Run the application

Open two PowerShell terminals in the project folder.

In the first terminal, start the backend:

```powershell
cd backend
npm install
npm run dev
```

The backend listens on port 5000. Notes are saved automatically in `backend/data/notes.json` when you first create a note. This data file is excluded from Git.

In the second terminal, start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the frontend terminal (usually `http://localhost:5173`).

## REST API examples

Base URL: `http://localhost:5000/api/notes`

Create a note (`POST /api/notes`, JSON body):

```json
{
  "title": "Lab revision",
  "content": "Review the notes application CRUD operations.",
  "category": "Study"
}
```

Read all notes: `GET /api/notes`

Read one note: `GET /api/notes/{noteId}`

Update a note (`PUT /api/notes/{noteId}`, JSON body):

```json
{
  "title": "Lab revision",
  "content": "Review and practise the notes application CRUD operations.",
  "category": "Study"
}
```

Delete a note: `DELETE /api/notes/{noteId}`

These requests can be sent from Postman with `Content-Type: application/json` for POST and PUT. The note ID is returned in the JSON response from POST or GET.

## Data flow

**React UI → Fetch API → Express REST API → JSON-file storage**, then the response returns through Express and Fetch API to the React UI. Notes persist across browser refreshes and backend restarts in `backend/data/notes.json`.
