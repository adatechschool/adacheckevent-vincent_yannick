import { useState, useEffect, use } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async (offset) => {
      try {
        const response = await fetch(`https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=2&offset=${offset}`, {
          signal: controller.signal
        })
        const dataFetch = await response.json()
        setData(dataFetch.results)
        console.log(dataFetch.results)
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          setError(err.message)
        }
      }
    }

    fetchData(offset)

    return () => controller.abort()
  }, [])

  if (error) {
    return <div>Erreur: {error}</div>
  }
  return data ? (
    <div className="App">
      <h1>Événements à Paris</h1>
      <p> {data.map((elem) => {
        return (
          <>
        <span key={elem.id}>{elem.title} <img src={elem.cover_url} alt={elem.title} />{elem.description}</span>
        <button onClick={() => fetchData(2)} className='bg-blue-500 rounded'>test</button>
          </>

        )
      })} </p>
      </div>
  )
  : (<div>Chargement des données...</div>
  )
}

export default App