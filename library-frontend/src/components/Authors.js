import { useState } from 'react';
import { useMutation } from '@apollo/client'
import Select from 'react-select';

import { EDIT_AUTHOR, ALL_CONTENT } from '../queries'

const Authors = ({ show, authors, notify }) => {
  const [name, setName] = useState(null);
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_CONTENT } ],
    onError: (error) => {
      const errors = error.graphQLErrors
      const messages = Object.values(errors).map(e => e.message).join('\n')
      console.log(messages)
      notify(messages)
    }
  })
  const submit = async (event) => {
    event.preventDefault()
    editAuthor({  variables: { name: name.value, born: parseInt(born) } })
    setBorn('')
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <Select
          defaultValue={name}
          onChange={setName}
          options={authors.map(a => ({ value: a.name, label: a.name })) }
        />
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
