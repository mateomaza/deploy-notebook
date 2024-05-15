import { useState, useEffect } from 'react';
import api from '@/services/api';
import PropTypes from 'prop-types';

const TagManager = ({ noteId }) => {
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  const fetchAvailableTags = async () => {
    const response = await api.get('/tags');
    setAvailableTags(response.data);
  };

  const handleAddTag = async () => {
    if (selectedTagId) {
      try {
        await api.put(`/tags/${selectedTagId}/notes/${noteId}`);
        setSelectedTagId('');
      } catch (error) {
        console.error('Failed to add tag:', error);
      }
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      await api.delete(`/tags/${tagId}/notes/${noteId}`);
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };

  const handleCreateTag = async () => {
    try {
      const response = await api.post('/tags', { name: newTag });
      setAvailableTags([...availableTags, response.data]);
      setNewTag('');
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  return (
    <div>
      <h3>Tags</h3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <select value={selectedTagId} onChange={(e) => setSelectedTagId(e.target.value)}>
          <option value="">Select Tag</option>
          {availableTags.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
        <button onClick={handleAddTag}>Confirm Tag</button>
      </div>
      <div>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New Tag"
        />
        <button onClick={handleCreateTag}>Create Tag</button>
      </div>
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            {tag.name}
            <button onClick={() => handleRemoveTag(tag.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

TagManager.propTypes = {
  noteId: PropTypes.number.isRequired
};

export default TagManager;
