import { Moon, Sun } from 'lucide-react';
import { useFinanceStore } from '../stores/financeStore';

const ThemeToggle = () => {
  const { theme, setTheme } = useFinanceStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-border/50 text-text-muted hover:text-text hover:bg-border transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
