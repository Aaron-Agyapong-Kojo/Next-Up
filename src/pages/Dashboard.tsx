import TodoList from "@/components/TodoList";
import ThemeButton from "@/components/ThemeButton";
import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText = "";

    if (hour < 12) {
      greetingText = "Good morning";
    } else if (hour < 18) {
      greetingText = "Good afternoon";
    } else {
      greetingText = "Good evening";
    }

    if (user?.firstName) {
      greetingText += `, ${user.firstName}`;
    }

    setGreeting(greetingText);
  }, [user]);

  const handleThemeChange = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "dark bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-secondary to-background"
      } py-6 sm:py-12`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              Next-Up
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">
              {greeting}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-background border-primary/20 hover:bg-destructive/10 hover:text-destructive w-full sm:w-auto"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
            <ThemeButton isDarkMode={isDarkMode} onClick={handleThemeChange} />
          </div>
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default Dashboard;
