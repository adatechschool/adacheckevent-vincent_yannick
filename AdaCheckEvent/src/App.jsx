import { useState, useEffect } from 'react'
import './App.css'
import { BtnScrollToTop } from './component/BtnScrollToTop'
import { Card } from './component/Card'
import { Search } from 'lucide-react'

function App() {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const limit = 20
  const fetchData = async (newOffset, newSearchTerm) => {
    const controller = new AbortController()
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
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setOffset(0)
    setData([])
    fetchData(0, searchTerm)
  }

    useEffect(() => {
    const handleScroll = () => {
      // Calcul de la position de scroll
      const scrollTop = document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      
      // Si on est proche du bas (100px avant la fin)
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setOffset(prevOffset => prevOffset + limit)
      }
    }

    // Ajouter l'écouteur d'événement
    window.addEventListener('scroll', handleScroll)
    
    // Nettoyer l'écouteur au démontage
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetchData(offset, searchTerm)
  }, [offset])

  if (error) {
    return <div>Erreur: {error}</div>
  }
  return data ? (
    <div className="App">
      <h1>Événements à Paris</h1>
      <div>
 {/* Barre de recherche */}
      <div className="search-container mb-6 p-4 bg-gray-100 rounded-lg">
        <form onSubmit={handleSearch} className="flex gap-2 mb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un événement (ex: concert, théâtre, exposition...)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            <Search />
          </button>

        </form>
        </div>
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