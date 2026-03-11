import React, { useEffect, useState } from "react";
import Cards from "./Cards";



const HomePage: React.FC = () => {






    return (
        <div className="min-w-full min-h-fit">


        <div className="overflow-hidden bg-linear-to-r from-sky-300 via-sky-50 to-sky-300 dark:from-sky-900 dark:via-sky-950 dark:to-sky-900 py-4">
 

    <p className="flex items-center justify between mx-40 text-7xl font-sans font-semibold text-blue-900 dark:text-gray-300">
      Your<br />Symptoms, 
    </p>

    <p className="flex items-center justify between mx-40 text-7xl font-sans font-semibold text-blue-400 dark:text-gray-300">
        Our<br /> Responsibility 

    </p>

    <p className="flex items-center justify between px-20 py-16 pl-40 text-xl font-semibold text-blue-800 dark:text-gray-300">
      Think of SymptoNexus as your first step to understanding and relief. <br />We
      provide helpful knowledge and connect you with doctors, but never
      replace <br />professional medical care or medication.
    </p>

    <div>

    </div>

  
</div>
        <div>
            <Cards/>
        </div>
        
    </div>
    );
};

export default HomePage;
