import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../../../services/ai.service';
import { useToast } from '../../../contexts/ToastContext';
import { Loader2, Settings2, ShieldCheck, ShieldAlert, SlidersHorizontal } from 'lucide-react';

import { AIModelSelector } from '../settings/AIModelSelector';
import { StrictnessSelector } from '../settings/StrictnessSelector';
import { IgnoreFilesInput } from '../settings/IgnoreFilesInput';
import { CoverageSlider } from '../settings/CoverageSlider';
import { TokenInput } from '../settings/TokenInput';
import { SettingsActions } from '../settings/SettingsActions';

export const RepositorySettingsTab = () => {
  const { repository, owner, repo } = useOutletContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. Fetch settings from backend
  const { data: serverSettings, isLoading, isError, refetch } = useQuery({
    queryKey: ['repoSettings', owner, repo],
    queryFn: () => aiService.getRepositorySettings(owner, repo),
    enabled: !!owner && !!repo,
  });

  // 2. Local State
  const [settings, setSettings] = useState(null);

  // Sync local state when server data loads
  useEffect(() => {
    if (serverSettings) {
      setSettings({
        ai_model: serverSettings.ai_model,
        review_strictness: serverSettings.review_strictness,
        ignore_files: serverSettings.ignore_files || [],
        coverage_threshold: serverSettings.coverage_threshold,
        max_tokens: serverSettings.max_tokens,
      });
    }
  }, [serverSettings]);

  // 3. Mutation for saving
  const mutation = useMutation({
    mutationFn: (newSettings) => aiService.updateRepositorySettings(owner, repo, newSettings),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['repoSettings', owner, repo], updatedData);
      toast.success("Your repository AI settings have been updated.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to save settings.");
    }
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <ShieldAlert className="w-12 h-12 text-destructive" />
        <p className="text-foreground font-medium">Failed to load settings.</p>
        <button onClick={() => refetch()} className="text-primary hover:underline text-sm font-medium">
          Try again
        </button>
      </div>
    );
  }

  if (isLoading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Loading repository settings...</p>
      </div>
    );
  }

  // Helpers to update local state
  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (serverSettings) {
      setSettings({
        ai_model: serverSettings.ai_model,
        review_strictness: serverSettings.review_strictness,
        ignore_files: serverSettings.ignore_files || [],
        coverage_threshold: serverSettings.coverage_threshold,
        max_tokens: serverSettings.max_tokens,
      });
    }
  };

  const handleSave = () => {
    mutation.mutate(settings);
  };

  // Check if anything changed
  const isDirty = JSON.stringify(settings) !== JSON.stringify({
    ai_model: serverSettings.ai_model,
    review_strictness: serverSettings.review_strictness,
    ignore_files: serverSettings.ignore_files || [],
    coverage_threshold: serverSettings.coverage_threshold,
    max_tokens: serverSettings.max_tokens,
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 pb-4 relative">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Repository Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure CodeGuardian AI behaviors for this repository.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mt-6 relative">
        <div className="px-6 py-5 border-b border-border bg-muted/20">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Configuration
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage how the AI interacts with your repository.
          </p>
        </div>

        <div className="px-6 flex flex-col divide-y divide-border/50">
          <AIModelSelector
            value={settings.ai_model}
            onChange={(val) => handleChange('ai_model', val)}
          />

          <StrictnessSelector
            value={settings.review_strictness}
            onChange={(val) => handleChange('review_strictness', val)}
          />

          <IgnoreFilesInput
            value={settings.ignore_files}
            onChange={(val) => handleChange('ignore_files', val)}
          />

          <CoverageSlider
            value={settings.coverage_threshold}
            onChange={(val) => handleChange('coverage_threshold', val)}
          />

          <TokenInput
            value={settings.max_tokens}
            onChange={(val) => handleChange('max_tokens', val)}
          />
        </div>
      </div>

      <SettingsActions
        isDirty={isDirty}
        isSaving={mutation.isPending}
        onSave={handleSave}
        onReset={handleReset}
      />
    </div>
  );
};
