
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

type ThemeButtonProps = {
  isDarkMode: boolean;
  onClick: () => void;
};

const ThemeButton: React.FC<ThemeButtonProps> = ({ isDarkMode, onClick }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2 bg-background border-primary/20 hover:bg-primary/10"
      onClick={onClick}
    >
      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
      <span>Toggle Theme</span>
    </Button>
  );
};

export default ThemeButton;
