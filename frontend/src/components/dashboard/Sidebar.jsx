import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderGit2, 
  GitPullRequest, 
  Bot, 
  BarChart3, 
  User,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Repositories', href: '/repositories', icon: FolderGit2 },
  { name: 'AI Reviews', href: '/ai-reviews', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Profile', href: '/profile', icon: User },
];

export const Sidebar = ({ className }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const isItemActive = (item) => {
    const path = location.pathname;
    
    if (item.href === '/') {
      return path === '/';
    }
    
    // Highlight AI Reviews tab if we are on the dashboard or viewing an individual AI review
    if (item.name === 'AI Reviews') {
      return path.startsWith('/ai-reviews') || path.endsWith('/ai-review');
    }
    
    // Highlight Repositories only if it's not an AI review
    if (item.name === 'Repositories') {
      return path.startsWith('/repositories') && !path.endsWith('/ai-review');
    }

    return path.startsWith(item.href);
  };

  return (
    <div className={cn("flex h-full w-64 flex-col border-r border-border bg-card", className)}>
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm">CG</span>
          </div>
          CodeGuardian AI
        </div>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1.5">
          {navigation.map((item) => {
            const active = isItemActive(item);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 shrink-0 transition-colors",
                    active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t border-border p-4">
        <button 
          onClick={() => setShowLogoutDialog(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500/10 to-rose-500/10 px-4 py-2.5 text-sm font-semibold text-red-600 active:scale-95 dark:text-red-400"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out of your account?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmLogout}>
            Logout
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
