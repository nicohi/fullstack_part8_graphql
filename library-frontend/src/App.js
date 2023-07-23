import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

import { useQuery, useApolloClient } from '@apollo/client'

import {
  ALL_CONTENT,
} from './queries'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
  useMatch
} from "react-router-dom"

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const result = useQuery(ALL_CONTENT)
  const client = useApolloClient()

  const padding = {
    paddingRight: 5
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/authors">authors</Link>
        <Link style={padding} to="/books">books</Link>
        { token ? <Link style={padding} to="/add">add book</Link> : null}
        { !token ? <Link style={padding} to="/login">login</Link> : <button style={padding} onClick={logout}>logout</button> }
      </div>

      <Notify errorMessage={errorMessage} />

      <Routes>
        <Route path="/" element={<Books show={true} books={result.data.allBooks} />} />
        <Route path="/authors" element={<Authors show={true} authors={result.data.allAuthors} />} />
        <Route path="/books" element={<Books show={true} books={result.data.allBooks} refetch={result.refetch} />} />
        <Route path="/add" element={<NewBook show={true} />} />
        <Route path="/login" element={<LoginForm setToken={setToken} setError={notify} /> } />
      </Routes>
    </div>
  )
}

export default App
