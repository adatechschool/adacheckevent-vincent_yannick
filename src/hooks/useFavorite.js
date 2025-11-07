import { useState, useEffect } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (eventId) => {
    setFavorites((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };
  const isFavorite = (eventId) => favorites.includes(eventId);

  const filterData = (data) => {
    return showFavoritesOnly
      ? data.filter((item) => favorites.includes(item.id))
      : data;
  };

  const toggleShowFavoritesOnly = () => {
    setShowFavoritesOnly((prev) => !prev);
  };

  return {
    favorites,
    toggleFavorite,
    showFavoritesOnly,
    toggleShowFavoritesOnly,
    isFavorite,
    filterData,
  };
};
