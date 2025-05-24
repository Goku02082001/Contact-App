import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  }, [onSearch]);

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search contacts by name or tag..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <button 
            className="clear-search" 
            onClick={() => {
              setSearchTerm('');
              onSearch('');
            }}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;