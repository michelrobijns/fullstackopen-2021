import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const showNotification = (message, type, duration) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService
          .updatePerson(existingPerson.id, { name: newName, number: newNumber })
          .then(updatedPerson => {
            setPersons(persons.filter(p => p.id !== updatedPerson.id).concat(updatedPerson))
            setNewName('')
            setNewNumber('')
            showNotification(`Updated ${updatedPerson.name}`, 'success', 5000)
          })
          .catch(error => {
            showNotification(error.response.data.error, 'errorMessage', 5000);
          });
      }
    } else {
      personsService
        .createPerson({ name: newName, number: newNumber })
        .then(addedPerson => {
          setPersons(persons.concat(addedPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`Added ${addedPerson.name}`, 'success', 5000)
        })
        .catch(error => {
          showNotification(error.response.data.error, 'errorMessage', 5000);
        });
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const deletePerson = (person) => () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deletePerson(person.id)
        .catch(() => {
          showNotification(`Information of ${person.name} has already been removed from server`, 'error', 5000)
        })
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const filteredPersons = filter === ''
    ?  persons
    :  persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <div>
        <h2>Phonebook</h2>
        <Notification notification={notification} />
        <Filter value={filter} handleFilterChange={handleFilterChange} />
      </div>
      <div>
        <h3>Add a new</h3>
        <PersonForm
          addPerson={addPerson}
          newName={newName}
          handleNameChange={handleNameChange}
          newNumber={newNumber}
          handleNumberChange={handleNumberChange}
        />
      </div>
      <div>
        <h3>Numbers</h3>
        <Persons persons={filteredPersons} deletePerson={deletePerson}/>
      </div>
    </>
  )
}

export default App
