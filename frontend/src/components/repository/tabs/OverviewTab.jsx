import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { RepositoryHeader } from '../../github/RepositoryHeader';
import { RepositoryStats } from '../../github/RepositoryStats';

export const OverviewTab = () => {
  const { repository } = useOutletContext();

  if (!repository) return null;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <RepositoryHeader repository={repository} />
      <RepositoryStats repository={repository} />
    </div>
  );
};
