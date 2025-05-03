
import TodoList from "@/components/TodoList";
import ThemeButton from "@/components/ThemeButton";
import { useState, useEffect } from "react";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Apply dark mode class to body element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const handleThemeChange = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-secondary to-background'} py-12`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Next-Up</h1>
          <ThemeButton isDarkMode={isDarkMode} onClick={handleThemeChange} />
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default Index;
