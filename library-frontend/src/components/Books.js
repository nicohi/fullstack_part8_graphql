import { useEffect } from 'react'

const Books = ({ show, books, refetch }) => {

  useEffect(() => {
    refetch({ genre: "" })
  }, [refetch, show])

  const getGenre = genre => async (event) => {
    event.preventDefault()
    //console.log(genre)

    refetch({ genre: genre })
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

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
      <div>
        {Array.from(books.map(b => b.genres)
                         .reduce((s, vv) => {
                           for (var i = 0; i<vv.length; i++)
                             s.add(vv[i])
                           return s
                         }, new Set()))
              .map( g => (
                <button key={g} onClick={getGenre(g)}>{g}</button>
              ))}
        <button key='all genres' onClick={getGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
