import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import '../styles/ContactForm.css';

const ContactForm = ({ 
  onAddContact, 
  onUpdateContact, 
  editingContact, 
  onCancelEdit,
  existingTags
}) => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    tags: [],
    favorite: false
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});

  // Reset form when editing different contact
  useEffect(() => {
    if (editingContact) {
      setContact({
        id: editingContact.id,
        name: editingContact.name,
        email: editingContact.email,
        tags: [...editingContact.tags],
        favorite: editingContact.favorite
      });
    } else {
      setContact({
        name: '',
        email: '',
        tags: [],
        favorite: false
      });
    }
    setErrors({});
  }, [editingContact]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContact(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

   
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !contact.tags.includes(newTag.trim())) {
      setContact(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setContact(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const selectExistingTag = (tag) => {
    if (!contact.tags.includes(tag)) {
      setContact(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!contact.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!contact.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (editingContact) {
        onUpdateContact(contact);
      } else {
        onAddContact({
          ...contact,
          id: Date.now().toString()
        });
        
        // Reset form after adding
        setContact({
          name: '',
          email: '',
          tags: [],
          favorite: false
        });
      }
    }
  };

  const filteredExistingTags = existingTags.filter(
    tag => !contact.tags.includes(tag)
  );

  return (
    <div className="contact-form-container">
      <h2>{editingContact ? 'Edit Contact' : 'Add New Contact'}</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={contact.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Full Name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="email@example.com"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <div className="tag-input-container">
            <input
              type="text"
              id="newTag"
              name="newTag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tag and press Enter"
            />
            <button 
              type="button" 
              onClick={addTag} 
              className="add-tag-btn"
              disabled={!newTag.trim()}
            >
              Add
            </button>
          </div>
          
          <div className="selected-tags">
            {contact.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button 
                  type="button" 
                  onClick={() => removeTag(tag)}
                  className="remove-tag"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          
          {filteredExistingTags.length > 0 && (
            <div className="existing-tags">
              <small>Existing tags:</small>
              <div>
                {filteredExistingTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className="existing-tag"
                    onClick={() => selectExistingTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="favorite"
            name="favorite"
            checked={contact.favorite}
            onChange={handleChange}
          />
          <label htmlFor="favorite">Mark as favorite</label>
        </div>
        
        <div className="form-actions">
          {editingContact && (
            <button 
              type="button" 
              onClick={onCancelEdit}
              className="cancel-button"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="submit-button">
            {editingContact ? 'Update Contact' : 'Add Contact'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;