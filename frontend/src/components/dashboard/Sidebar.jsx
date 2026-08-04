import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderGit2, 
  GitPullRequest, 
  Bot, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Repositories', href: '/repositories', icon: FolderGit2 },
  { name: 'Pull Requests', href: '/pull-requests', icon: GitPullRequest },
  { name: 'AI Reviews', href: '/reviews', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = ({ className }) => {
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
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Bottom section if needed */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Pro Plan</p>
              <p className="text-xs text-muted-foreground">1,240/2,000 requests</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-border overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '62%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
