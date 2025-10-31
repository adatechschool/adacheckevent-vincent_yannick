import { useState } from "react";

export const Card = ({ element, isFavorite, onToggleFavorite }) => {
  let description = element.description || "";
  description = description.replace(/<[^>]+>/g, "");
  description = description.replace(/&amp;/g, "&");
  const descriptionTruncated = description.substring(0, 160) + "...";
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      key={element.id}
      className="border p-4 rounded-lg shadow-md mb-4 bg-gray-800/50"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
          {element.title}
        </h3>
        <button
          onClick={onToggleFavorite}
          className={`text-2xl transition-colors hover:scale-110 mt-2 sm:mt-0 ${
            isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-300"
          }`}
          aria-label={
            isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
          }
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
      {element.cover_url && (
        <img
          src={element.cover_url}
          alt={element.title}
          className="w-full h-48 md:h-56 lg:h-64 object-cover rounded mb-3"
        />
      )}

      <p className="text-white mb-3">
        {isExpanded ? description : descriptionTruncated}
      </p>

      {description.length > 160 && (
        <button
          className="font-mono cursor-pointer px-4 py-2 rounded bg-gradient-to-t from-green-600/75 to-green-400 shadow-[0_0_15px_rgba(0,255,100,0.3)] hover:bg-green-900 text-white transition-colors"
          onClick={toggleDescription}
        >
          {isExpanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
};
