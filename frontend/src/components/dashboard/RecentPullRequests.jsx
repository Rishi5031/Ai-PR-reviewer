import React from 'react';
import { GitPullRequest, GitMerge, GitPullRequestClosed } from 'lucide-react';
import { cn } from '../../lib/utils';

const statusStyles = {
  open: {
    bg: 'bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    icon: GitPullRequest
  },
  merged: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    icon: GitMerge
  },
  closed: {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    icon: GitPullRequestClosed
  },
  reviewing: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    icon: GitPullRequest
  }
};

export const RecentPullRequests = ({ data }) => {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Pull Requests</h3>
        <p className="text-sm text-muted-foreground">Your team's latest pull request activity.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-muted-foreground">
          <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Repository</th>
              <th className="px-6 py-4 font-medium">PR Number</th>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Created</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pr, idx) => {
              const style = statusStyles[pr.status] || statusStyles.open;
              const StatusIcon = style.icon;
              
              return (
                <tr key={pr.id} className={cn("hover:bg-muted/50 transition-colors", idx !== data.length - 1 && "border-b border-border")}>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {pr.repository}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-muted px-2 py-1 rounded-md text-xs">#{pr.number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {pr.author.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{pr.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", style.bg, style.text)}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {pr.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pr.createdAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
