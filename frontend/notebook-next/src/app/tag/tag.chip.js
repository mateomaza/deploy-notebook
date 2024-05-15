import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import PropTypes from 'prop-types';

function TagChip({ tag, noteId, onRemove }) {
  const handleDelete = (event) => {
    event.stopPropagation();
    onRemove(tag.id, noteId);
  };

  return (
    <Chip
      label={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {tag.name}
          <IconButton size="small" onClick={handleDelete} style={{ marginLeft: '8px' }}>
            <CancelIcon fontSize="small" />
          </IconButton>
        </div>
      }
      variant="outlined"
      size="small"
      style={{ margin: '5px' }}
    />
  );
}

TagChip.propTypes = {
  tag: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  noteId: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default TagChip;