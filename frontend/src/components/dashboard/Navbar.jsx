import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false); // Just UI toggle for now, actual logic depends on your theme provider

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Capitalize path for breadcrumb
  const pathName = location.pathname === '/' 
    ? 'Dashboard' 
    : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2).replace('-', ' ');

  const initials = user?.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden items-center gap-2 text-sm md:flex">
          <span className="font-medium text-muted-foreground">CodeGuardian AI</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">{pathName}</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        {/* Search Box */}
        <div className="relative hidden sm:block max-w-md w-full ml-4 md:ml-0 md:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-md border border-input bg-muted/50 pl-9 pr-4 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
          </button>

          {/* User Avatar */}
          <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 cursor-pointer transition-colors hover:bg-primary/20">
            <span className="text-xs font-semibold text-primary">
              {initials}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
