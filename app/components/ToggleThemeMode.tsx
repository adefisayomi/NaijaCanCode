import { useEffect, useState } from "react";
import { Sun, Moon, LaptopMinimal, Loader2 } from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/components/ui/toggle-group";
import { useTheme } from "remix-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

type Theme = "light" | "dark" | "system";

export default function ToggleThemeMode() {
  const [theme, setTheme] = useTheme(); // Type inferred from remix-themes
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!theme) {
      setTheme(getCurrentSystemTheme());
    }
  }, [theme, setTheme]);

  if (!mounted) {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }

  const handleToggleTheme = (value: Theme) => {
    setTheme(value);
  };

  return (
    <div className="flex items-center gap-1 justify-between">
      <h2 className="capitalize text-xs">Theme</h2>

      <ToggleGroup
        type="single"
        size="sm"
        className="bg-background rounded-md p-1"
        value={theme || "system"} // Fallback to "system" if theme is null
        onValueChange={handleToggleTheme}
      >
          <ToggleGroupItem
            value="light"
            className="h-7 w-7"
            aria-label="Toggle light"
          >
            <Sun className="h-3 w-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="dark"
            className="h-7 w-7"
            aria-label="Toggle dark"
          >
            <Moon className="h-3 w-4" />
          </ToggleGroupItem>
        
          <ToggleGroupItem
            value="system"
            className="h-7 w-7"
            aria-label="Toggle system"
          >
            <LaptopMinimal className="h-3 w-4" />
          </ToggleGroupItem>

      </ToggleGroup>
      
    </div>
  );
}

function getCurrentSystemTheme(): Theme {
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  return darkThemeMq.matches ? "dark" : "light";
}
