import { useState, useEffect } from 'react'
import './App.css'
import { BtnScrollToTop } from './component/BtnScrollToTop'
import { Card } from './component/Card'

function App() {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = async (newOffset, search = '') => {
    setLoading(true)
    const controller = new AbortController()
    try {
      // Construction de l'URL avec paramètre de recherche
      let url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=20&offset=${newOffset}`
      
      if (search.trim()) {
        // Utilise le paramètre 'search' de l'API pour rechercher dans tous les champs
        url += `&search=${encodeURIComponent(search.trim())}`
      }

      const response = await fetch(url, {
        signal: controller.signal
      })
      const dataFetch = await response.json()
      
      // Si pas de nouveaux résultats, on arrête
      if (!dataFetch.results || dataFetch.results.length === 0) {
        setHasMore(false)
        setLoading(false)
        return
      }

      if (newOffset === 0) {
        // Nouvelle recherche : remplacer les données
        setData(dataFetch.results)
      } else {
        // Scroll infini : ajouter les données
        setData((prev) => {
          const newIds = new Set(prev.map(item => item.id))
          const filteredResults = dataFetch.results.filter(item => !newIds.has(item.id))
          return [...prev, ...filteredResults]
        })
      }
      
      console.log('Données récupérées avec offset:', newOffset, 'recherche:', search, dataFetch.results)
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Fonction de recherche
  const handleSearch = (e) => {
    e.preventDefault()
    setOffset(0)
    setHasMore(true)
    setData([]) // Reset des données
    fetchData(0, searchTerm)
  }

  // Reset de la recherche
  const clearSearch = () => {
    setSearchTerm('')
    setOffset(0)
    setHasMore(true)
    setData([])
    fetchData(0, '')
  }

    useEffect(() => {
    const handleScroll = () => {
      // Désactiver le scroll infini pendant le chargement ou si plus de données
      if (loading || !hasMore) return
      
      // Calcul de la position de scroll
      const scrollTop = document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      
      // Si on est proche du bas (100px avant la fin)
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setOffset(prevOffset => {
          const newOffset = prevOffset + 20
          fetchData(newOffset, searchTerm) // Inclure le terme de recherche
          return newOffset
        })
      }
    }

    // Ajouter l'écouteur d'événement
    window.addEventListener('scroll', handleScroll)
    
    // Nettoyer l'écouteur au démontage
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore, searchTerm])

  // Chargement initial
  useEffect(() => {
    fetchData(0, '')
  }, [])

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