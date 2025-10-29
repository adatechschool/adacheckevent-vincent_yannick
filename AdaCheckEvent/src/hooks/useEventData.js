import { useState, useEffect, useCallback } from 'react'

export const useEventData = (initialSearchTerm = "") => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [isFetching, setIsFetching] = useState(false)
  
  const limit = 20

  // Fonction de fetch sans dépendance sur isFetching
  const fetchData = useCallback(async (newOffset, newSearchTerm = searchTerm) => {
    setIsFetching(true)
    setError(null)
    
    try {
      let url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=${limit}&offset=${newOffset}`
      if (newSearchTerm) {
        url += `&where=search(title, "${encodeURIComponent(newSearchTerm)}")`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const dataFetch = await response.json()
      console.log('URL:', response.url)
      
      setData((prev) => {
        // Si c'est un nouveau search (offset = 0), remplacer les données
        if (newOffset === 0) {
          return dataFetch.results || []
        }
        
        // Sinon, ajouter en évitant les doublons
        const newIds = new Set(prev.map(item => item.id))
        const filteredResults = (dataFetch.results || []).filter(item => !newIds.has(item.id))
        return [...prev, ...filteredResults]
      })
      
      console.log('Données récupérées avec offset:', newOffset, dataFetch.results?.length || 0)
    } catch (err) {
      console.error('Erreur fetch:', err)
      setError(err.message)
    } finally {
      setIsFetching(false)
    }
  }, [searchTerm, limit])

  // Fonction de recherche
  const handleSearch = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm)
    setOffset(0)
    setData([])
    fetchData(0, newSearchTerm)
  }, [fetchData])

  // Fonction pour charger plus
  const loadMore = useCallback(() => {
    if (!isFetching) {
      const newOffset = offset + limit
      setOffset(newOffset)
      fetchData(newOffset, searchTerm)
      // console.log("searchTerm dans loadMore:", searchTerm)
    }
  }, [isFetching, offset, limit, fetchData])

  // Fonction de gestion du scroll infini
  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight
    
    // Si on est proche du bas (100px avant la fin) et qu'on ne fetch pas déjà
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isFetching) {
      loadMore()
    }
  }, [isFetching, loadMore])

  // Reset des données
  const resetData = useCallback(() => {
    setData([])
    setOffset(0)
    setError(null)
    setSearchTerm("")
  }, [])

  // Chargement initial uniquement
  useEffect(() => {
    fetchData(0, initialSearchTerm)
  }, [])

  // Gestion du scroll infini
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return {
    data,
    error,
    isFetching,
    searchTerm,
    setSearchTerm,
    handleSearch,
    loadMore,
    resetData
  }
}