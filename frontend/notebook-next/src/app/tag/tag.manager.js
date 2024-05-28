import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import PropTypes from "prop-types";

const TagManager = ({
  noteId,
  tags,
  selectedTagId,
  newTag,
  successMessage,
  setSelectedTagId,
  setNewTag,
  handleCreateTag,
}) => {
  const [noteTags, setNoteTags] = useState([]);

  const fetchTagsForNote = useCallback(async () => {
    try {
      const response = await api.get(`/notes/${noteId}/tags`);
      setNoteTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags for note:", error);
    }
  }, [noteId]);

  useEffect(() => {
    fetchTagsForNote();
  }, [fetchTagsForNote]);

  const handleAddTag = async () => {
    if (noteTags.length >= 3) {
      alert("Notes can only have 3 tags each");
      return;
    }
    if (selectedTagId) {
      try {
        await api.put(`/tags/${selectedTagId}/notes/${noteId}`);
        setSelectedTagId("");
        fetchTagsForNote();
      } catch (error) {
        console.error("Failed to add tag:", error);
      }
    }
  };

  return (
    <div style={{ margin: "20px", marginTop: "50px" }}>
      <h3 style={{ marginBottom: "10px" }}>Tags</h3>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <select
          value={selectedTagId}
          onChange={(e) => setSelectedTagId(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="">Select Tag</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddTag}>Add Tag</button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New Tag"
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleCreateTag}>Create Tag</button>
        {successMessage && <p style={{ marginTop: "10px" }}>{successMessage}</p>}
      </div>
    </div>
  );
};

TagManager.propTypes = {
  noteId: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired,
  selectedTagId: PropTypes.string.isRequired,
  newTag: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  setSelectedTagId: PropTypes.func.isRequired,
  setNewTag: PropTypes.func.isRequired,
  handleCreateTag: PropTypes.func.isRequired,
};

export default TagManager;
