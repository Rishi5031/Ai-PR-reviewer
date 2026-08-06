import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NeedsAttention = ({ items = [] }) => {
  const navigate = useNavigate();

  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20'
        };
      case 'high':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          badgeClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
        };
    }
  };

  const handleAction = (item) => {
    const [owner, name] = item.repository.split('/');
    if (item.pr_number) {
      navigate(`/pulls/${owner}/${name}/${item.pr_number}`);
    } else {
      navigate(`/repositories/${owner}/${name}`);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">Needs Attention</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const config = getPriorityConfig(item.priority);
          return (
            <Card key={index} className="flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center space-x-2">
                  {config.icon}
                  <CardTitle className="text-sm font-medium">{item.type}</CardTitle>
                </div>
                <Badge variant="outline" className={config.badgeClass}>
                  {item.priority}
                </Badge>
              </CardHeader>
              <CardContent className="pt-2 flex-grow flex flex-col justify-between">
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Repository: <span className="text-foreground font-medium">{item.repository}</span></p>
                  {item.pr_number && (
                    <p>PR: <span className="text-foreground font-medium">#{item.pr_number}</span></p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-between mt-auto hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleAction(item)}
                >
                  {item.pr_number ? 'Review Now' : 'View Repository'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
