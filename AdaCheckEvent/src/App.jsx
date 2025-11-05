import "./App.css";
import { BtnScrollToTop } from "./component/BtnScrollToTop";
import { ListCards } from "./component/ListCards";
import { useEventData } from "./hooks/useEventData";
import { useFavorites } from "./hooks/useFavorite";
import { useState, useEffect } from "react";

function App() {
  const {
    toggleFavorite,
    isFavorite,
    showFavoritesOnly,
    toggleShowFavoritesOnly,
    filterData,
    favorites,
  } = useFavorites();
  const {
    data,
    error,
    isFetching,
    searchTerm,
    setSearchTerm,
    handleSearch,
    orderToggle,
    setOrderToggle,
  } = useEventData("", !showFavoritesOnly);

  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const displayedData = showFavoritesOnly ? filterData(data) : data;

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return data ? (
    <>
      <div className="App">
        <button>
          <div
            className="fixed top-4 right-4 px-4 py-2  w-24 h-10 flex items-center rounded-full cursor-pointer transition-all duration-300 shadow-2xl border border-gray-300"
            onClick={() => setDarkMode(!darkMode)}
            style={{
              backgroundImage: `url(${darkMode ? "./night.jpg" : "./day.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className={`w-8 h-8 rounded-full shadow-lg transition-transform transform duration-500 flex items-center justify-center ${
                darkMode
                  ? "translate-x-[42px] bg-gradient-to-r from-gray-700 to-gray-900 shadow-inner"
                  : "translate-x-[-10px] bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg"
              }`}
              style={{
                boxShadow:
                  "inset 0px 2px 4px rgba(0, 0, 0, 0.4), 0px 4px 6px rgba(0, 0, 0, 0.6)",
              }}
            >
              {darkMode ? (
                <span>🌙</span>
              ) : (
                <span>☀️</span>
              )}
            </div>
          </div>
        </button>
        <h1 className="text-2xl md:text-4xl text-white p-4 font-mono">
          Événements à Paris
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center px-4">
          <button
            onClick={toggleShowFavoritesOnly}
            className={`font-mono px-6 py-3 rounded-lg font-semibold transition-all ${
              showFavoritesOnly
                ? "bg-gradient-to-t from-red-600/75 to-red-400 shadow-[0_0_15px_rgba(255,0,0,0.8)] text-white dark:text-gray-900 hover:bg-black/90"
                : "bg-gradient-to-t from-green-600/75 to-green-400 shadow-[0_0_15px_rgba(0,255,100,0.3)] text-white dark:text-gray-900 hover:bg-green-900"
            }`}
          >
            {showFavoritesOnly
              ? "❤️ Favoris uniquement"
              : "📋 Tous les événements"}
          </button>
          <div className="font-mono px-4 py-3 bg-blue-100 rounded-lg border">
            <span className="font-semibold text-blue-800">
              {favorites.length} favori{favorites.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        {showFavoritesOnly && displayedData.length === 0 ? (
          <div className="text-center py-12 rounded-lg">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-xl text-gray-600 mb-4">
              Aucun favori pour le moment
            </p>
            <p className="text-gray-500 mb-6">
              cliquez sur 🤍 pour ajouter des événements aux favoris !
            </p>
            <button
              onClick={toggleShowFavoritesOnly}
              className="font-mono px-6 py-2 bg-gradient-to-t from-green-600/75 to-green-400 shadow-[0_0_15px_rgba(0,255,100,0.3)]  hover:bg-green-900 text-white rounded-lg "
            >
              Voir tous les événements
            </button>
          </div>
        ) : (
          <>
            {showFavoritesOnly && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-center">
                <span className="text-red-700 font-medium">
                  ❤️ affichage : {displayedData.length} favori
                  {displayedData.length !== 1 ? "s" : ""} sur {data.length}{" "}
                  événement{data.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            <ListCards
              data={displayedData}
              onSearch={handleSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isFetching={isFetching}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              orderToggle={orderToggle}
              setOrderToggle={setOrderToggle}
            />
          </>
        )}
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
