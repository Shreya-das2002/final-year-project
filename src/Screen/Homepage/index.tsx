import React, { useEffect, useState } from "react";
import background from "../../assets/Background.jpg";
import dark_background from "../../assets/dark_background.jpg";
import Transparent_logo from "../../assets/Transparent_logo.jpg";
import Cards from "./Cards";


const HomePage: React.FC = () => {
    const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
    const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
    }, []);

    return (
        <div className="min-w-full min-h-fit">
        <div className="flex flex-col items-center justify-center py-6 shadow-md bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: `url(${isDark ? dark_background : background})`,
        }}
        >
        <img
            src={Transparent_logo}
            alt="Logo"
            className="w-90 h-70 object-contain rounded-full mb-3"
        />

        </div>

        <div className="overflow-hidden bg-linear-to-r from-sky-300 via-sky-50 to-sky-300 dark:from-sky-900 dark:via-sky-950 dark:to-sky-900 py-4">
  <div className="flex whitespace-nowrap animate-slide">

    <p className="mx-40 text-xl font-sans font-semibold text-blue-800 dark:text-gray-300">
      Think of SymptoNexus as your first step to understanding and relief. We
      provide helpful knowledge and connect you with doctors, but never
      replace professional medical care or medication.
    </p>

    <p className="mx-40 text-xl font-sans font-semibold text-blue-800 dark:text-gray-300">
      Think of SymptoNexus as your first step to understanding and relief. We
      provide helpful knowledge and connect you with doctors, but never
      replace professional medical care or medication.
    </p>

  </div>
</div>
        <div>
            <Cards/>
        </div>
        
    </div>
    );
};

export default HomePage;
