import { Moon, Sun, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm border border-border/50 p-1 rounded-full shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={cn(
          "h-8 w-8 rounded-full transition-all",
          theme === "light" && "bg-background shadow-sm text-primary"
        )}
        title="Light Mode"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light Mode</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={cn(
          "h-8 w-8 rounded-full transition-all",
          theme === "system" && "bg-background shadow-sm text-primary"
        )}
        title="System Mode"
      >
        <Laptop className="h-4 w-4" />
        <span className="sr-only">System Mode</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={cn(
          "h-8 w-8 rounded-full transition-all",
          theme === "dark" && "bg-background shadow-sm text-primary"
        )}
        title="Dark Mode"
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark Mode</span>
      </Button>
    </div>
  )
}
