import { useState, useCallback, useEffect } from "react";
import api from "@/services/api";
import PropTypes from "prop-types";
import TagManager from "./tag.manager";

const TagManagerWrapper = ({ noteId, onTagChange }) => {
  const [tags, setTags] = useState([]);
  const [noteTags, setNoteTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [newTag, setNewTag] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchTags = useCallback(async () => {
    try {
      const response = await api.get("/tags");
      setTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  }, []);

  const fetchTagsForNote = useCallback(async () => {
    try {
      const response = await api.get(`/notes/${noteId}/tags`);
      setNoteTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags for note:", error);
    }
  }, [noteId]);

  useEffect(() => {
    fetchTags();
    fetchTagsForNote();
  }, [fetchTags, fetchTagsForNote]);

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

  const handleCreateTag = async (e) => {
    e.preventDefault();
    try {
      await fetchTags();
      onTagChange();
      const response = await api.post("/tags", { name: newTag });
      setTags([...tags, response.data]);
      setNewTag("");
      setSuccessMessage("Tag was created successfully.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  return (
    <TagManager
      tags={tags}
      selectedTagId={selectedTagId}
      newTag={newTag}
      successMessage={successMessage}
      setSelectedTagId={setSelectedTagId}
      setNewTag={setNewTag}
      handleAddTag={handleAddTag}
      handleCreateTag={handleCreateTag}
    />
  );
};

TagManagerWrapper.propTypes = {
  noteId: PropTypes.number.isRequired,
  onTagChange: PropTypes.func.isRequired,
};

export default TagManagerWrapper;
