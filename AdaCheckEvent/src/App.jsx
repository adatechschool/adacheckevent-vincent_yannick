import "./App.css";
import { BtnScrollToTop } from "./component/BtnScrollToTop";
import { ListCards } from "./component/ListCards";
import { useEventData } from "./hooks/useEventData";
import { useState, useEffect } from "react";

function App() {
  const { data, error, isFetching, searchTerm, setSearchTerm, handleSearch } =
    useEventData();

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return data ? (
    <>
      <div className="App">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-4 right-4 px-4 py-2"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
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
    </>
  ) : (
    <>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 px-4 py-2 border-red-500 border rounded-lg"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
      <div>Chargement des données...</div>
    </>
  );
}

export default App;
