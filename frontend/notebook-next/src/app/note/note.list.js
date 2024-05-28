import { useState, useCallback } from "react";
import api from "@/services/api";
import Filter from "../common/filter";
import NoteForm from "./note.form";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import TagChip from "../tag/tag.chip";
import "../globals.css";

const NoteList = ({ type, refetchTags }) => {
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
    setOpen(false);
    fetchNotes();
  };

  const handleClose = () => {
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
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId)
    );
  };

  async function removeTagFromNote(tagId, noteId) {
    await api.delete(`/tags/${tagId}/notes/${noteId}`);
    fetchNotes();
  }

  return (
    <>
      <Filter onFilter={fetchNotesByTag} refetchTags={refetchTags} />
      <ul className="note-list">
        {notes.map((note) => (
          <li key={note.id} className="note-item">
            <div>
              <h3 className="note-title">{note.title}</h3>
              <p className="note-content">{note.content}</p>
            </div>
            <div className="note-actions">
              <button onClick={() => handleEdit(note)} className="note-button">
                Edit
              </button>
              {type === "active" ? (
                <button
                  onClick={() => handleArchive(note.id)}
                  className="note-button"
                >
                  Archive
                </button>
              ) : (
                <button
                  onClick={() => handleUnarchive(note.id)}
                  className="note-button"
                >
                  Unarchive
                </button>
              )}
              <button
                onClick={() => handleDelete(note.id)}
                className="note-button"
              >
                Delete
              </button>
            </div>
            <div className="note-tags">
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
            </div>
          </li>
        ))}
      </ul>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Edit Note
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <NoteForm note={currentNote} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </>
  );
};

NoteList.propTypes = {
  type: PropTypes.string.isRequired,
  refetchTags: PropTypes.object.isRequired
};

export default NoteList;
