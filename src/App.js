import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation, viewNote as viewNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  async function viewNote({ id }) {
    const newNotesArray = notes.filter(note => note.id === id);
    setNotes(newNotesArray);
    await API.graphql({ query: viewNoteMutation, variables: { input: { id } }});
  }

  async function shuffleNote() {
    // await API.graphql({ query: deleteNoteMutation, variables: { }});
  }

  return (
    <div className="App">
      <h1>My Intelligent Notes</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <br></br>
      <br></br>
      <button onClick={() => shuffleNote()}>Shuffle</button>
      <br></br>
      <br></br>
      <div style={{marginBottom: 30}}>
        <table>
          <tr>
            <th width="100">Name</th>
            <th width="400">Description</th>
            <th width="100">Delete</th>
          </tr>
        {
          notes.map(note => (
            // <div key={note.id || note.name}>
              <tr>
                <td width="100"><a href="#" onClick={() => viewNote(note)}>{note.name}</a></td>
                <td width="400"><p>{note.description}</p></td>
                <td width="100"><button onClick={() => deleteNote(note)}>Delete note</button></td>
              </tr>
            // </div>
          ))
        }
        </table>
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);