import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { GitPullRequest, Settings, CheckCircle2, Activity } from 'lucide-react';

export const RecentActivity = ({ activity = [] }) => {
  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'review generated':
      case 'review requested':
        return <GitPullRequest className="h-4 w-4" />;
      case 'settings updated':
        return <Settings className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getIconColor = (type) => {
    switch (type.toLowerCase()) {
      case 'review generated':
        return 'text-green-500 bg-green-500/10';
      case 'review requested':
        return 'text-blue-500 bg-blue-500/10';
      case 'settings updated':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activity.map((item, index) => (
            <div key={index} className="flex relative">
              {/* Timeline connecting line */}
              {index !== activity.length - 1 && (
                <div className="absolute left-4 top-8 bottom-[-24px] w-[2px] bg-border" />
              )}
              
              <div className={`mt-1 mr-4 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(item.activity_type)}`}>
                {getIcon(item.activity_type)}
              </div>
              
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {item.activity_type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="text-xs text-muted-foreground pt-1">
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          {activity.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
