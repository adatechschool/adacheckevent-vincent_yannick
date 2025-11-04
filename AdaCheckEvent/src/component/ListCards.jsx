import { useState } from "react";
import { Card } from "./Card";
import { ArrowUpNarrowWide, ArrowDownNarrowWide, Search } from "lucide-react";

export function ListCards({
  data,
  onSearch,
  searchTerm,
  setSearchTerm,
  isFetching,
  toggleFavorite,
  isFavorite,
  orderToggle,
  setOrderToggle
}) {
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div>
      {/* Barre de recherche */}
      <div className="search-container mb-6 p-4 rounded-lg dark:text-white">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 mb-2"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un événement (ex: concert, théâtre, exposition...)"
            className="w-full sm:flex-1 px-4 py-2 border border-teal-600 dark:border-gray-600 dark:bg-gray-900 dark:placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 dark:focus:ring-green-600"
          />
          <button
            type="button"
            onClick={() => setOrderToggle((prev) => !prev)}
            className="px-3 py-2 cursor-pointer bg-gradient-to-t from-green-600/75 to-green-400 shadow-[0_0_15px_rgba(0,255,100,0.3)]  text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
            aria-label="Toggle order"
          >
            {orderToggle ? <ArrowUpNarrowWide /> : <ArrowDownNarrowWide />}
          </button>
          <button
            type="submit"
            disabled={isFetching}
            className="px-6 py-2 bg-gradient-to-t from-green-600/75 to-green-400 shadow-[0_0_15px_rgba(0,255,100,0.3)]  text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
          >
            <Search />
          </button>
        </form>
      </div>

      {/* Liste des cartes */}
      <div className="grid grid-cols-1 gap-4 px-4">
        {data.map((elem) => (
          <Card
            key={elem.id}
            element={elem}
            isFavorite={isFavorite(elem.id)}
            onToggleFavorite={() => toggleFavorite(elem.id)}
          />
        ))}
      </div>

      {/* Indicateur de chargement */}
      {isFetching && (
        <div className="text-center mt-4 p-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      )}
    </div>
  );
}
