import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export const RecommendationCard = ({ recommendation }) => {
  let config = {
    bgClass: 'bg-info/10',
    borderClass: 'border-info/20',
    textClass: 'text-info',
    Icon: Info,
    title: 'Notice',
  };

  const recLower = (recommendation || '').toLowerCase();

  if (recLower.includes('approve')) {
    if (recLower.includes('change')) {
      config = {
        bgClass: 'bg-warning/10',
        borderClass: 'border-warning/20',
        textClass: 'text-warning',
        Icon: AlertTriangle,
        title: 'Approve with Changes',
      };
    } else {
      config = {
        bgClass: 'bg-success/10',
        borderClass: 'border-success/20',
        textClass: 'text-success',
        Icon: CheckCircle,
        title: 'Approve',
      };
    }
  } else if (recLower.includes('request')) {
    config = {
      bgClass: 'bg-destructive/10',
      borderClass: 'border-destructive/20',
      textClass: 'text-destructive',
      Icon: XCircle,
      title: 'Request Changes',
    };
  } else if (recommendation) {
    config.title = recommendation;
  }

  const { Icon, title, bgClass, borderClass, textClass } = config;

  return (
    <div className={`border ${borderClass} ${bgClass} p-6 rounded-lg shadow-sm flex flex-col items-center justify-center text-center h-full`}>
      <Icon className={`w-12 h-12 mb-4 ${textClass}`} />
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Recommendation</h3>
      <span className={`text-xl font-bold ${textClass}`}>
        {title}
      </span>
    </div>
  );
};
