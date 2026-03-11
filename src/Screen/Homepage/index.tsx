import Cards from "./Cards";
import side_poster from "../../assets/side_poster.png";


const HomePage: React.FC = () => {






    return (
        <div className="min-w-full min-h-fit">


<div className="flex items-center justify-between px-20 py-16 bg-gradient-to-r from-blue-100  to-blue-300 dark:from-sky-700 dark:via-sky-800 dark:to-sky-950">

  {/* Left Side Text */}
  <div className="max-w-xl">
    <h1 className="text-6xl font-semibold text-blue-800 dark:text-gray-300">
      Your Symptoms,
      <br />
      <span className="text-blue-400 dark:text-gray-300">Our Responsibility</span>
    </h1>

    <p className="mt-6 text-blue-900 dark:text-gray-300">
      Think of SymptoNexus as your first step to understanding and relief.
      We provide helpful knowledge and connect you with doctors,
      but never replace professional medical care or medication.
    </p>
  </div>

  {/* Right Side Image */}
  <div className="bg-blue-200 p-1 rounded-md shadow ">
    <img src={side_poster} alt="Side Poster" className="w-100 h-auto" />
  </div>

</div>
        <div>
            <Cards/>
        </div>
        
    </div>
    );
};

export default HomePage;
