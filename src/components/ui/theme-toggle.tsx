"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/theme-provider";
import { Gamepad2 } from "lucide-react";
import { THEME_OPTIONS } from "@/lib/types/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Helper to get icon component by name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Sun":
        return Sun;
      case "Moon":
        return Moon;
      case "Gamepad2":
        return Gamepad2;
      default:
        return Sun;
    }
  };

  // Find current theme option
  const currentThemeOption =
    THEME_OPTIONS.find((option) => option.value === theme) || THEME_OPTIONS[0];
  const CurrentIcon = getIconComponent(currentThemeOption.icon);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <CurrentIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEME_OPTIONS.map((option) => {
          const IconComponent = getIconComponent(option.icon);
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
