import { useState, useCallback } from "react";
import api from "@/services/api";
import Filter from "../common/filter";
import NoteForm from "./note.form";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TagChip from "../tag/tag.chip";

const NoteList = ({ type }) => {
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const fetchNotes = useCallback(
    async (tagId = "") => {
      const url = tagId ? `/notes/${type}?tag=${tagId}` : `/notes/${type}`;
      const response = await api.get(url);
      setNotes(response.data);
    },
    [type]
  );

  const fetchNotesByTag = useCallback(
    async (tagId) => {
      if (!tagId) {
        fetchNotes();
        return;
      }
      const response = await api.get(`/tags/${tagId}/notes`, {
        params: { type: type },
      });
      setNotes(response.data);
    },
    [fetchNotes, type]
  );

  const handleSave = () => {
    fetchNotes();
    setOpen(false);
  };

  const handleArchive = async (noteId) => {
    await api.put(`/notes/${noteId}/archive`);
    fetchNotes();
  };

  const handleUnarchive = async (noteId) => {
    await api.put(`/notes/${noteId}/unarchive`);
    fetchNotes();
  };

  const handleEdit = (note) => {
    setCurrentNote(note);
    setOpen(true);
  };

  const handleDelete = async (noteId) => {
    await api.delete(`/notes/${noteId}`);
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function removeTagFromNote(tagId, noteId) {
    await api.delete(`/tags/${tagId}/notes/${noteId}`);
    fetchNotes();
  }

  return (
    <>
      <Filter onFilter={fetchNotesByTag} />
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleEdit(note)}>Edit</button>
            {type === "active" ? (
              <button onClick={() => handleArchive(note.id)}>Archive</button>
            ) : (
              <button onClick={() => handleUnarchive(note.id)}>
                Unarchive
              </button>
            )}
            <button onClick={() => handleDelete(note.id)}>Delete</button>
            {note.tags &&
              note.tags.length > 0 &&
              note.tags.map((tag) => (
                <TagChip
                  key={tag.id}
                  tag={tag}
                  noteId={note.id}
                  onRemove={removeTagFromNote}
                />
              ))}
          </li>
        ))}
      </ul>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <NoteForm note={currentNote} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </>
  );
};

NoteList.propTypes = {
  type: PropTypes.string.isRequired,
};

export default NoteList;
