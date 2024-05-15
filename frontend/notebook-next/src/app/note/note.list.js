import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import Filter from "../common/filter";
import NoteForm from "./note.form";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Chip from '@mui/material/Chip';

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
      const response = await api.get(`/tags/${tagId}/notes`);
      setNotes(response.data);
    },
    [fetchNotes]
  );

  useEffect(() => {
    fetchNotes();
  }, [type, fetchNotes]);

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

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    fetchNotes();
    setOpen(false);
  };

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
            {note.tags && note.tags.length > 0 && note.tags.map(tag => (
              <Chip label={tag.name} key={tag.id} />
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
