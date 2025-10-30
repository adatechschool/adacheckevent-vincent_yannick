import { useState } from "react";
import { Card } from "./Card";
import { Search } from "lucide-react";

export function ListCards({
  data,
  onSearch,
  searchTerm,
  setSearchTerm,
  isFetching,
}) {
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
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
            disabled={isFetching}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            <Search />
          </button>
        </form>
      </div>

      {/* Liste des cartes */}
      <div className="grid gap-4">
        {data.map((elem) => (
          <Card key={elem.id} element={elem} />
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
