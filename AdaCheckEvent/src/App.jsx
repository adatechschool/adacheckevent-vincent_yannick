import './App.css'
import { BtnScrollToTop } from './component/BtnScrollToTop'
import { ListCards } from './component/ListCards'
import { useEventData } from './hooks/useEventData'

function App() {
  const {
    data,
    error,
    isFetching,
    searchTerm,
    setSearchTerm,
    handleSearch
  } = useEventData()

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