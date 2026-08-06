import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';

export const RepositoryOverview = ({ repositories = [] }) => {
  const navigate = useNavigate();

  const getHealthColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent':
      case 'very good':
      case 'good':
      case 'healthy':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'needs improvement':
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Repository Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-md">Repository</th>
                <th className="px-4 py-3">Health Score</th>
                <th className="px-4 py-3">Open PRs</th>
                <th className="px-4 py-3">Reviewed PRs</th>
                <th className="px-4 py-3">Last Review</th>
                <th className="px-4 py-3 rounded-tr-md">Status</th>
              </tr>
            </thead>
            <tbody>
              {repositories.map((repo) => (
                <tr 
                  key={repo.id} 
                  className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/repositories/${repo.owner}/${repo.name}`)}
                >
                  <td className="px-4 py-4 font-medium text-foreground">
                    {repo.owner}/{repo.name}
                  </td>
                  <td className="px-4 py-4">{repo.health?.toFixed(1) || '0.0'}</td>
                  <td className="px-4 py-4">{repo.open_prs}</td>
                  <td className="px-4 py-4">{repo.reviewed_prs}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {repo.last_review ? new Date(repo.last_review).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className={getHealthColor(repo.status)}>
                      {repo.status || 'Unknown'}
                    </Badge>
                  </td>
                </tr>
              ))}
              {repositories.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No repositories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
