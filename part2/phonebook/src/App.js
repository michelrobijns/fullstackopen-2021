import React, { useState, useEffect } from 'react';
import personService from './services/persons';

const Filter = ({ filterText, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filterText} onChange={handleFilterChange}></input>
    </div>
  );
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

const Persons = ({ persons, handleDelete }) => {
  return (
    persons.map((person) => <Person key={person.name} person={person} handleDelete={() => handleDelete(person)} />)
  );
}

const Person = ({ person, handleDelete }) => {
  return (
    <span>{person.name} {person.number} <button onClick={handleDelete}>delete</button><br /></span>
  );
}

const Notificaton = ({ message, messageType }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.type}>
      {message.text}
    </div>
  );
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterText, setFilterText] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const showNotification = (text, type, duration) => {
    setMessage({ text, type })
    setTimeout(() => {
      setMessage(null);
    }, duration);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (existingPerson.number === newNumber) {
        alert(`${newName} is already added to phonebook`);
      } else {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          personService
            .update(existingPerson.id, { name: newName, number: newNumber })
            .then(response => {
              setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data));
              setNewName('');
              setNewNumber('');
              showNotification(`Updated ${response.data.name}`, 'successMessage', 3000);
            });
        }
      }
    } else {
      personService
        .create({ name: newName, number: newNumber })
        .then(response => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
          showNotification(`Added ${response.data.name}`, 'successMessage', 3000);
        });
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  }

  const handleDelete = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id));
        })
        .catch(error => {
          showNotification(`Information of ${person.name} has already been removed from the server`, 'errorMessage', 3000);
        });
    }
  }

  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(filterText.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notificaton message={message} />
      <Filter filterText={filterText} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App;
