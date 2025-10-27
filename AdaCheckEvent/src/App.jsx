import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const response = await fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=1&offset=2', {
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

    fetchData()

    return () => controller.abort()
  }, [])

  if (error) {
    return <div>Erreur: {error}</div>
  }
  return data ? (
    <div className="App">
      <h1>Événements à Paris</h1>
      <p> {data.map((elem) => {
        return (<span key={elem.id}>{elem.title} <img src={elem.cover_url} alt={elem.title} />{elem.description}</span>)
      })} </p>
      </div>
  )
  : (<div>Chargement des données...</div>
  )
}

export default App