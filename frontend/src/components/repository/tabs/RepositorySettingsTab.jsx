import React from 'react';
import { useOutletContext } from 'react-router-dom';

export const RepositorySettingsTab = () => {
  const { repository } = useOutletContext();

  const settingsOptions = [
    { name: 'Review Strictness', description: 'Configure how strict the AI should be when reviewing code.', action: 'Moderate' },
    { name: 'Ignored Files', description: 'List of file patterns to ignore during AI reviews.', action: 'None' },
    { name: 'Excluded Directories', description: 'Directories to skip for AI processing.', action: 'node_modules, .git' },
    { name: 'Webhook Settings', description: 'Manage GitHub webhooks for automated reviews.', action: 'Configured' },
    { name: 'Auto Review', description: 'Automatically trigger reviews on new Pull Requests.', action: 'Enabled' },
    { name: 'Default Branch', description: 'The primary branch used for baseline comparisons.', action: repository?.default_branch || 'main' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Repository Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure CodeGuardian AI behaviors for this repository.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <ul className="divide-y divide-border">
          {settingsOptions.map((setting) => (
            <li key={setting.name} className="px-6 py-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{setting.name}</span>
                <span className="text-sm text-muted-foreground mt-1">{setting.description}</span>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-md">
                  {setting.action}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Irreversible actions for this repository.
        </p>
        <button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Disconnect Repository
        </button>
      </div>
    </div>
  );
};
