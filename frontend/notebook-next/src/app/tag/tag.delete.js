import { useState, useCallback } from "react";
import api from "@/services/api";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";

const TagDelete = ({ open, onClose }) => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchTags = useCallback(async () => {
    try {
      const response = await api.get("/tags");
      setTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  }, []);

  if (open) {
    fetchTags();
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/tags/${selectedTag}`);
      fetchTags();
      setSelectedTag("");
      setSuccessMessage("Tag was deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Delete Tag
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="">Select a tag...</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <Button onClick={handleDelete} style={{ marginRight: "10px" }}>
          Delete
        </Button>
        {successMessage && <p>{successMessage}</p>}
      </DialogContent>
    </Dialog>
  );
};

TagDelete.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TagDelete;
