import React from 'react';

export const RepositoryFilters = ({
  languageFilter,
  setLanguageFilter,
  visibilityFilter,
  setVisibilityFilter,
  sortBy,
  setSortBy,
  languages
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={visibilityFilter}
        onChange={(e) => setVisibilityFilter(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="all">All Visibility</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      <select
        value={languageFilter}
        onChange={(e) => setLanguageFilter(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="all">All Languages</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="updated">Recently Updated</option>
        <option value="stars">Most Stars</option>
        <option value="name">Name (A-Z)</option>
      </select>
    </div>
  );
};
