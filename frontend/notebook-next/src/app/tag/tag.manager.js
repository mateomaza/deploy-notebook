import PropTypes from "prop-types";

const TagManager = ({
  tags,
  selectedTagId,
  newTag,
  successMessage,
  setSelectedTagId,
  setNewTag,
  handleAddTag,
  handleCreateTag
}) => {
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
  tags: PropTypes.array.isRequired,
  selectedTagId: PropTypes.string.isRequired,
  newTag: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  setSelectedTagId: PropTypes.func.isRequired,
  setNewTag: PropTypes.func.isRequired,
  handleAddTag: PropTypes.func.isRequired,
  handleCreateTag: PropTypes.func.isRequired,
};

export default TagManager;
