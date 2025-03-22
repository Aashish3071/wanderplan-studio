import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useThemeContext } from '@/components/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Icons.moon className="h-5 w-5" /> : <Icons.sun className="h-5 w-5" />}
    </Button>
  );
}
