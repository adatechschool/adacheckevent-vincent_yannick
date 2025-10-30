import { useState, useEffect } from "react";
import { ArrowUpFromLine } from "lucide-react";
export const BtnScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300); // bouton visible après 300px de scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition"
      >
        <ArrowUpFromLine />
      </button>
    )
  );
};
