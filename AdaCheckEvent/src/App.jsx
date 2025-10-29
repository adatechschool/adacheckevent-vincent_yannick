import { useState, useEffect } from 'react'
import './App.css'
import { BtnScrollToTop } from './component/BtnScrollToTop'
import { ListCards } from './component/ListCards'

function App() {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFetching, setIsFetching] = useState(false)
  
  const limit = 20
  const fetchData = async (newOffset, newSearchTerm) => {
    const controller = new AbortController()
    if (isFetching) return
    setIsFetching(true)
    try {
      let url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=${limit}&offset=${newOffset}`
      if (newSearchTerm) {
        url += `&where=search(title, "${encodeURIComponent(newSearchTerm)}")`
      }
      let response = await fetch(url, {
        signal: controller.signal
      })
      const dataFetch = await response.json()
      console.log(response.url)
      
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
    } finally {
      setIsFetching(false)
    }
  }

  const handleSearch = (newSearchTerm) => {
    setOffset(0)
    setData([])
    fetchData(0, newSearchTerm)
  }

    useEffect(() => {
    const handleScroll = () => {
      // Calcul de la position de scroll
      const scrollTop = document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      
      // Si on est proche du bas (100px avant la fin)
      if (scrollTop + clientHeight >= scrollHeight - 100 && !isFetching) {
        setOffset(prevOffset => prevOffset + limit)
      }
    }

    // Ajouter l'écouteur d'événement
    window.addEventListener('scroll', handleScroll)
    
    // Nettoyer l'écouteur au démontage
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isFetching])

  useEffect(() => {
    fetchData(offset, searchTerm)
  }, [offset])

  if (error) {
    return <div>Erreur: {error}</div>
  }
  return data ? (
    <div className="App">
      <h1>Événements à Paris</h1>
      <ListCards 
        data={data}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isFetching={isFetching}
      />
      <BtnScrollToTop />
    </div>
  ) : (
    <div>Chargement des données...</div>
  )
}

export default App