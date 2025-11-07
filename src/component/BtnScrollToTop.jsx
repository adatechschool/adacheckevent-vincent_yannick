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
        className="fixed bottom-5 right-5 bg-green-600 hover:bg-green-700 shadow-[0_0_15px_rgba(0,255,100,0.3)] text-white dark:text-gray-900  p-3 rounded-full transition"
      >
        <ArrowUpFromLine />
      </button>
    )
  );
};
