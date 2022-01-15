import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { listStudents } from './graphql/queries';
import { createStudent as createStudentMutation, deleteStudent as deleteStudentMutation } from './graphql/mutations';
import awsExports from './aws-exports';
Amplify.configure(awsExports);
const initialFormState = { name: '', age: '', address:'' }


export default function App() {
  const [Students, setStudents] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const apiData = await API.graphql({ query: listStudents });
    setStudents(apiData.data.listStudents.items);
  }

  async function createStudent() {
    if (!formData.name || !formData.age || !formData.address) return;
    await API.graphql({ query: createStudentMutation, variables: { input: formData } });
    setStudents([ ...Students, formData ]);
    setFormData(initialFormState);
  }

  async function deleteStudent({ id }) {
    const newStudentsArray = Students.filter(Student => Student.id !== id);
    setStudents(newStudentsArray);
    await API.graphql({ query: deleteStudentMutation, variables: { input: { id } }});
  }
  return (
    <div>
      <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
    <h1>My Students App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Student name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'age': e.target.value})}
        placeholder="Student age"
        value={formData.age}
      />
      <input
        onChange={e => setFormData({ ...formData, 'address': e.target.value})}
        placeholder="Student address"
        value={formData.address}
      />
      <button onClick={createStudent}>Create Student</button>
      <div style={{marginBottom: 30}}>
        {
          Students.map(Student => (
            <div key={Student.id || Student.name}>
              <table>
                <tr>
                  <th>
                    name
                  </th>
                  <th>
                    age
                  </th>
                  <th>
                    address
                  </th>
                  <th>
                    action
                  </th>
                </tr>
                
                <tr>
                  <td>
                    {Student.name}
                  </td>
                  <td>
                    {Student.age}
                  </td>
                  <td>
                    {Student.address}
                  </td>
                  <td>
                    <button onClick={() => deleteStudent(Student)}>Delete Student</button>
                  </td>
                </tr>
              </table>
            </div>
          ))
        }
      </div>
    </div>
    
  );
}