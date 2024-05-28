import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import api from "@/services/api";
import PropTypes from "prop-types";

const Filter = forwardRef(({ onFilter }, ref) => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  const fetchTags = async () => {
    const response = await api.get("/tags");
    setTags(response.data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useImperativeHandle(ref, () => ({
    refetchTags: fetchTags,
  }));

  useEffect(() => {
    onFilter(selectedTag);
  }, [selectedTag, onFilter]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <select
        onChange={(e) => setSelectedTag(e.target.value)}
        style={{ marginRight: "10px" }}
      >
        <option value="">All Notes</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
});

Filter.displayName = "Filter";

Filter.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default Filter;
