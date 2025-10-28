import { useState } from "react";

export const Card = ({ element }) => {
  //   console.log(element);

  const description = element.description.replace(/<[^>]+>/g, "");
  const descriptionTroncate = description.substring(0, 160) + "[...]";
  const [displayDescription, setDisplayDescription] =
    useState(descriptionTroncate);
  const [seeMore, setSeeMore] = useState(false);
  const handleSeeMore = () => {
    setDisplayDescription(description);
    setSeeMore(true);
  };
  const handleSeeLess = () => {
    setDisplayDescription(descriptionTroncate);
    setSeeMore(false);
  };

  return seeMore ? (
    <div key={element.id}>
      <span>{element.title}</span>
      <img src={element.cover_url} alt={element.title} />
      <p>{displayDescription}</p>

      <button
        className="cursor-pointer px-2 py-2 rounded bg-blue-500"
        onClick={(id) => {
          handleSeeLess(id);
        }}
      >
        Voir moins
      </button>
    </div>
  ) : (
    <div key={element.id}>
      <span>{element.title}</span>
      <img src={element.cover_url} alt={element.title} />
      <p>{displayDescription}</p>

      <button
        className="cursor-pointer px-2 py-2 rounded bg-blue-500"
        onClick={() => {
          handleSeeMore();
        }}
      >
        Voir plus
      </button>
    </div>
  );
};
