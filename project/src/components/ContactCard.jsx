import { useState, useCallback, memo } from 'react';
import { Heart, Trash2, Edit } from 'lucide-react';
import '../styles/ContactCard.css';

const ContactCard = memo(({ contact, onDelete, onToggleFavorite, onEdit }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleDelete = useCallback(() => {
    onDelete(contact.id);
  }, [contact.id, onDelete]);

  const handleFavoriteToggle = useCallback(() => {
    onToggleFavorite(contact.id);
  }, [contact.id, onToggleFavorite]);

  const handleEdit = useCallback(() => {
    onEdit(contact);
  }, [contact, onEdit]);

  return (
    <div 
      className={`contact-card ${contact.favorite ? 'favorite' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="contact-info">
        <h3 className="contact-name">{contact.name}</h3>
        <p className="contact-email">{contact.email}</p>
        
        <div className="tags-container">
          {contact.tags.map(tag => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="contact-actions">
        <button 
          className={`favorite-button ${contact.favorite ? 'active' : ''}`}
          onClick={handleFavoriteToggle}
          aria-label={contact.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={20} 
            fill={contact.favorite ? "#ff3366" : "none"} 
            stroke={contact.favorite ? "#ff3366" : "#666"}
          />
        </button>
        
        <button 
          className={`edit-button ${isHovering ? 'visible' : ''}`}
          onClick={handleEdit}
          aria-label="Edit contact"
        >
          <Edit size={18} />
        </button>
        
        <button 
          className={`delete-button ${isHovering ? 'visible' : ''}`}
          onClick={handleDelete}
          aria-label="Delete contact"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
});

ContactCard.displayName = 'ContactCard';

export default ContactCard;