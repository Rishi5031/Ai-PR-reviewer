import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
            <div className="space-y-3 flex-1">
              <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <div className="flex gap-4 border-b border-border pb-2">
        <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
      </div>

      {/* Form Skeleton */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="h-6 w-1/4 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
            <div className="h-24 w-full bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
