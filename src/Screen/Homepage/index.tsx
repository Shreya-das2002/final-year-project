import Cards from "./Cards";
import logo from "../../assets/logo_2.0.png";   
import new_background from "../../assets/new_background.png";   


const HomePage: React.FC = () => {






    return (
        <div className=" pt-0">

        <div   className="min-h-screen bg-cover bg-center items-center flex-col justify-center px-20 pt-35 py-10"
  style={{ backgroundImage: `url(${new_background})` }}>

<div className="flex justify-between">

  {/* Left Side Text */}
  <div className="max-w-xl pt-0 pl-5">
    <h1 className="text-6xl font-semibold text-cyan-900">
      Your <br /> Symptoms, Our
      <br />
      <span className="text-sky-700 font-bold"> Responsibility</span>
    </h1>

    <p className="mt-6  font-bold text-cyan-950">
      Think of SymptoNexus as your first step to understanding <br /> and relief.
      We provide helpful knowledge and connect you with doctors,
      but never replace professional medical care or medication.
    </p>
  </div>

  {/* Right Side Image */}

    <div className="flex justify-end pr-140px pt-10 text-6xl ">
        

  <img src={logo} alt="Logo" className="w-50 h-50"  />
  
        <div>
            <p className=" text-sky-900 text-6xl font-sans pt-10 ">
                SYMPTONEXUS
            </p>
            <p className=" text-sky-900 text-2xl font-bold pt-5 ">
                From Symptoms to Smarter Care
                </p>

        </div>

  </div>


   </div>
   </div>

        <div>
            <Cards/>
        </div>
        
    </div>
    );
};

export default HomePage;
