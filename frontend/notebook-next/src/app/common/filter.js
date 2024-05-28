import { useState, useEffect } from 'react';
import api from '@/services/api';
import PropTypes from "prop-types";

const Filter = ({ onFilter, refetchTags }) => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  const fetchTags = async () => {
    const response = await api.get('/tags');
    setTags(response.data);
  };

  useEffect(() => {
    fetchTags();
    if (refetchTags) {
      refetchTags.current = fetchTags;
    }
  }, [refetchTags]);

  useEffect(() => {
    onFilter(selectedTag);
  }, [selectedTag, onFilter]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <select onChange={(e) => setSelectedTag(e.target.value)} style={{ marginRight: '10px' }}>
        <option value="">All Notes</option>
        {tags.map(tag => (
          <option key={tag.id} value={tag.id}>{tag.name}</option>
        ))}
      </select>
    </div>
  );
};

Filter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  onTagChange: PropTypes.func.isRequired,
  refetchTags: PropTypes.object.isRequired
};

export default Filter;
