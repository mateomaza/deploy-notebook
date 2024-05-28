import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import TagManager from "../tag/tag.manager";
import PropTypes from "prop-types";

const NoteForm = ({ note, onSave, onTagChange }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content cannot be empty");
      return;
    }
    try {
      if (note) {
        await api.put(`/notes/${note.id}`, { title, content });
      } else {
        await api.post("/notes", { title, content });
      }
      onSave();
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Failed to save the note. Please try again.");
    }
  };

  const fetchTags = useCallback(async () => {
    try {
      const response = await api.get("/tags");
      setTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleCreateTag = async (e) => {
    e.preventDefault();
    try {
      await fetchTags();
      const response = await api.post("/tags", { name: newTag });
      setTags([...tags, response.data]);
      setNewTag("");
      setSuccessMessage("Tag was created successfully.");
      setTimeout(() => setSuccessMessage(""), 5000);
      onTagChange();
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", margin: "10px 0" }}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ display: "block", margin: "10px 0" }}
      />
      <button type="submit" style={{ margin: "10px 0" }}>
        Save
      </button>
      {note?.id && (
        <TagManager
          noteId={note.id}
          tags={tags}
          newTag={newTag}
          setNewTag={setNewTag}
          successMessage={successMessage}
          handleCreateTag={handleCreateTag}
          style={{ margin: "10px 0" }}
        />
      )}
    </form>
  );
};

NoteForm.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onTagChange: PropTypes.func.isRequired,
};

export default NoteForm;
