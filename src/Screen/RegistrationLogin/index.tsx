
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react';
import background from "../../assets/Background.jpg";
import dark_background from "../../assets/dark_background.jpg";
import signup_logo from "../../assets/signup_logo.jpg";
import dark_signup from "../../assets/dark_signup.jpg"


const RegistrationLogin = () => {
   //  Detect dark mode
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
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 bg-cover bg-center"
      style={{
        backgroundImage: `url(${isDark ? dark_background : background})`,
      }}
    >
      <div className="bg-white dark:bg-gray-800 shadow-lg p-8 w-full max-w-md rounded-3xl bg-opacity-90 dark:bg-opacity-90"
      style={{
        backgroundImage: `url(${isDark ? dark_signup : signup_logo})`,
      }}
    >
      <Outlet />
    </div>
        
    </div>
  )
}

export default RegistrationLogin;