import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  'Approve': 'hsl(var(--success))',
  'Approve with Changes': 'hsl(var(--warning))',
  'Request Changes': 'hsl(var(--error))',
  'Unknown': 'hsl(var(--muted-foreground))'
};

export const RecommendationChart = ({ data }) => {
  return (
    <div className="bg-card border border-border p-6 rounded-lg shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recommendation Distribution</h3>
      <div className="flex-1 w-full min-h-[300px]">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="recommendation"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.recommendation] || COLORS['Unknown']} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No recommendation data
          </div>
        )}
      </div>
    </div>
  );
};
