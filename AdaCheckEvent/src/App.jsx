import { useState, useEffect } from 'react'
import './App.css'
import { BtnScrollToTop } from './component/BtnScrollToTop'
import { Card } from './component/Card'

function App() {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)

  const fetchData = async (newOffset) => {
    const controller = new AbortController()
    try {
      const response = await fetch(`https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=20&offset=${newOffset}`, {
        signal: controller.signal
      })
      const dataFetch = await response.json()
      
      // Remplacer les données au lieu de les accumuler pour éviter les doublons
      setData((prev) => {
        const newIds = new Set(prev.map(item => item.id))
        const filteredResults = dataFetch.results.filter(item => !newIds.has(item.id))
        return [...prev, ...filteredResults]
      })
      console.log('Données récupérées avec offset:', newOffset, dataFetch.results)
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted')
      } else {
        setError(err.message)
      }
    }
  }

    useEffect(() => {
    const handleScroll = () => {
      // Calcul de la position de scroll
      const scrollTop = document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      
      // Si on est proche du bas (100px avant la fin)
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setOffset(prevOffset => prevOffset + 20)
      }
    }

    // Ajouter l'écouteur d'événement
    window.addEventListener('scroll', handleScroll)
    
    // Nettoyer l'écouteur au démontage
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetchData(offset)
  }, [offset])

  if (error) {
    return <div>Erreur: {error}</div>
  }
  return data ? (
    <div className="App">
      <h1>Événements à Paris</h1>
      <div>
        <p>Offset actuel: {offset}</p>
        <button onClick={() => setOffset(offset + 20)} className='bg-blue-500 rounded'>
          Suivant (offset +20)
        </button>
        <button onClick={() => setOffset(Math.max(0, offset - 20))} className='bg-red-500 rounded'>
          Précédent (offset -20)
        </button>
      </div>
      <div className="grid gap-4"> 
        {data.map((elem) => (
          <Card key={elem.id} element={elem} />
        ))} 
      </div>
      <BtnScrollToTop />
      </div>
  )
  : (
  <div>Chargement des données...</div>
  )
}

export default App