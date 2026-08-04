import React from 'react';
import { RepositoryCard } from './RepositoryCard';
import { EmptyRepositories } from './EmptyRepositories';

export const RepositoryGrid = ({ repositories, isLoading }) => {
  if (repositories.length === 0) {
    return <EmptyRepositories type="no_results" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {repositories.map(repo => (
        <RepositoryCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
};
