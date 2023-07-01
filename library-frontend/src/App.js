import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { useQuery } from '@apollo/client'

import { ALL_CONTENT } from './queries'

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



const App = () => {
  const result = useQuery(ALL_CONTENT)

  const padding = {
    paddingRight: 5
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/authors">authors</Link>
        <Link style={padding} to="/books">books</Link>
        <Link style={padding} to="/add">add</Link>
      </div>


      <Routes>
        <Route path="/" element={<Books show={true} books={result.data.allBooks} />} />
        <Route path="/authors" element={<Authors show={true} authors={result.data.allAuthors} />} />
        <Route path="/books" element={<Books show={true} books={result.data.allBooks} />} />
        <Route path="/add" element={<NewBook show={true} />} />
      </Routes>
    </div>
  )
}

export default App
