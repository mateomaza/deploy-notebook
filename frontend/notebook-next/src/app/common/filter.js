import { useState, useEffect } from 'react';
import api from '@/services/api';
import PropTypes from "prop-types";

const Filter = ({ onFilter }) => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      const response = await api.get('/tags');
      setTags(response.data);
    };
    fetchTags();
  }, []);

  useEffect(() => {
    onFilter(selectedTag);
  }, [selectedTag, onFilter]);

  return (
    <select onChange={(e) => setSelectedTag(e.target.value)}>
      <option value="">All Notes</option>
      {tags.map(tag => (
        <option key={tag.id} value={tag.id}>{tag.name}</option>
      ))}
    </select>
  );
};

Filter.propTypes = {
  onFilter: PropTypes.func.isRequired
};

export default Filter;
