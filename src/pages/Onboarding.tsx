
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { LogIn, User } from "lucide-react";
import ThemeButton from "@/components/ThemeButton";

const Onboarding = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Apply dark mode class to body element
  useState(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
  
  const handleThemeChange = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-secondary to-background'} flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="absolute top-4 right-4">
        <ThemeButton isDarkMode={isDarkMode} onClick={handleThemeChange} />
      </div>
      
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Next-Up</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Your Smart Todo Assistant</p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Organize Your Day</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Next-Up helps you keep track of your tasks with a simple, intuitive interface.
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Visualize Your Tasks</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Add images to your tasks to make them more memorable and actionable.
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Track Your Progress</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mark tasks as complete and clear finished tasks to stay focused on what matters.
            </p>
          </div>
        </div>
        
        <div className="pt-4 space-y-4">
          <SignUpButton mode="modal">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              <User className="mr-2" />
              Sign Up
            </Button>
          </SignUpButton>
          
          <SignInButton mode="modal">
            <Button variant="outline" className="w-full">
              <LogIn className="mr-2" />
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
