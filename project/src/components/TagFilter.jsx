import { memo } from 'react';
import { Tag } from 'lucide-react';
import '../styles/TagFilter.css';

const TagFilter = memo(({ 
  tags, 
  selectedTags, 
  onSelectTag, 
  showFavoritesOnly, 
  onToggleFavoriteFilter 
}) => {
  const handleTagClick = (tag) => {
    onSelectTag(tag);
  };

  return (
    <div className="tag-filter-container">
      <div className="filter-header">
        <Tag size={16} />
        <span>Filter by:</span>
      </div>
      
      <div className="filter-options">
        <button 
          className={`favorite-filter ${showFavoritesOnly ? 'active' : ''}`}
          onClick={onToggleFavoriteFilter}
        >
          Favorites
        </button>
        
        {tags.map(tag => (
          <button
            key={tag}
            className={`tag-filter ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
        
        {selectedTags.length > 0 && (
          <button 
            className="clear-filters"
            onClick={() => onSelectTag(null, true)}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
});

TagFilter.displayName = 'TagFilter';

export default TagFilter;