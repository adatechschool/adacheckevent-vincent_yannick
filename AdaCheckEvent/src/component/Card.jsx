import { useState } from "react";

export const Card = ({ element }) => {
  let description = element.description || "";
  description = description.replace(/<[^>]+>/g, "") 
  description = description.replace(/&amp;/g, "&");
  const descriptionTruncated = description.substring(0, 160) + "...";
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div key={element.id} className="border p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-bold mb-2">{element.title}</h3>
      {element.cover_url && (
        <img 
          src={element.cover_url} 
          alt={element.title} 
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}
      
      <p className="text-gray-700 mb-3">
        {isExpanded ? description : descriptionTruncated}
      </p>

      {description.length > 160 && (
        <button
          className="cursor-pointer px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={toggleDescription}
        >
          {isExpanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div> 
  );
};