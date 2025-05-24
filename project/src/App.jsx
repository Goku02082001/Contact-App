import { useState, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import SearchBar from './components/SearchBar';
import TagFilter from './components/TagFilter';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import './styles/App.css';

const App = () => {
  const [contacts, setContacts] = useLocalStorage('contacts', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  
  const allTags = useMemo(() => {
    const tagSet = new Set();
    contacts.forEach(contact => {
      contact.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [contacts]);

  
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = 
        debouncedSearchTerm === '' || 
        contact.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        contact.tags.some(tag => 
          tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.every(tag => contact.tags.includes(tag));
      
      const matchesFavorite = !showFavoritesOnly || contact.favorite;
      
      return matchesSearch && matchesTags && matchesFavorite;
    });
  }, [contacts, debouncedSearchTerm, selectedTags, showFavoritesOnly]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleTagSelect = useCallback((tag, clearAll = false) => {
    if (clearAll) {
      setSelectedTags([]);
    } else if (tag === null) {
      setSelectedTags([]);
    } else {
      setSelectedTags(prevTags => 
        prevTags.includes(tag)
          ? prevTags.filter(t => t !== tag) 
          : [...prevTags, tag]
      );
    }
  }, []);

  const toggleFavoriteFilter = useCallback(() => {
    setShowFavoritesOnly(prev => !prev);
  }, []);

  const addContact = useCallback((newContact) => {
    setContacts(prev => [newContact, ...prev]);
    setShowAddForm(false);
  }, [setContacts]);

  const updateContact = useCallback((updatedContact) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
    setEditingContact(null);
  }, [setContacts]);

  const deleteContact = useCallback((id) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    
    
    if (editingContact && editingContact.id === id) {
      setEditingContact(null);
    }
  }, [setContacts, editingContact]);

  const toggleFavorite = useCallback((id) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === id
          ? { ...contact, favorite: !contact.favorite }
          : contact
      )
    );
  }, [setContacts]);

  const startEditingContact = useCallback((contact) => {
    setEditingContact(contact);
    setShowAddForm(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingContact(null);
    setShowAddForm(false);
  }, []);

  const toggleAddForm = useCallback(() => {
    setShowAddForm(prev => !prev);
    setEditingContact(null);
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Contacts</h1>
        <button 
          className={`add-contact-button ${showAddForm ? 'active' : ''}`}
          onClick={toggleAddForm}
          title={showAddForm ? 'Close form' : 'Add new contact'}
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="main-content">
        <div className={`sidebar ${showAddForm ? 'form-open' : ''}`}>
          {showAddForm ? (
            <ContactForm
              onAddContact={addContact}
              onUpdateContact={updateContact}
              editingContact={editingContact}
              onCancelEdit={cancelEdit}
              existingTags={allTags}
            />
          ) : (
            <>
              <SearchBar onSearch={handleSearch} />
              
              {allTags.length > 0 && (
                <TagFilter 
                  tags={allTags}
                  selectedTags={selectedTags}
                  onSelectTag={handleTagSelect}
                  showFavoritesOnly={showFavoritesOnly}
                  onToggleFavoriteFilter={toggleFavoriteFilter}
                />
              )}
              
              <div className="contacts-info">
                <p>
                  <span className="total-count">{filteredContacts.length}</span> 
                  {filteredContacts.length === 1 ? ' contact' : ' contacts'}
                  {(debouncedSearchTerm || selectedTags.length > 0 || showFavoritesOnly) ? ' found' : ''}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="contacts-container">
          <ContactList 
            contacts={filteredContacts}
            onDeleteContact={deleteContact}
            onToggleFavorite={toggleFavorite}
            onEditContact={startEditingContact}
          />
        </div>
      </div>
    </div>
  );
};

export default App;