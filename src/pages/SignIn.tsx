
import { SignIn } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

const SignInPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Apply dark mode class to body element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-secondary to-background'} flex flex-col justify-center items-center`}>
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
};

export default SignInPage;
