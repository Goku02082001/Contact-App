import { useCallback } from 'react';
import ContactCard from './ContactCard';
import '../styles/ContactList.css';

const ContactList = ({ 
  contacts,
  onDeleteContact,
  onToggleFavorite,
  onEditContact
}) => {
  const handleDelete = useCallback((id) => {
    onDeleteContact(id);
  }, [onDeleteContact]);

  const handleToggleFavorite = useCallback((id) => {
    onToggleFavorite(id);
  }, [onToggleFavorite]);

  const handleEdit = useCallback((contact) => {
    onEditContact(contact);
  }, [onEditContact]);

  if (contacts.length === 0) {
    return (
      <div className="no-contacts">
        <p>No contacts found. Try adjusting your filters or add a new contact.</p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      {contacts.map(contact => (
        <ContactCard 
          key={contact.id}
          contact={contact}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default ContactList;