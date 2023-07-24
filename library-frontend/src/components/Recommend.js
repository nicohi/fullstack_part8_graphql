import { useEffect } from 'react';
import { useQuery } from '@apollo/client'
import { ME } from '../queries'

const Recommend = ({ show, books, genre, refetch }) => {
  useEffect(() => {
    refetch({ genre: genre })
  })

  if (!show ) {
    return null
  }

  return (
    <div>
      <h2>recommended "{genre}" books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
