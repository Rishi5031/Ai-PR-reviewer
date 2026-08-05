import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const IssueCategoryChart = ({ data }) => {
  return (
    <div className="bg-card border border-border p-6 rounded-lg shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-foreground mb-4">Issue Category Distribution</h3>
      <div className="flex-1 w-full min-h-[300px]">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11} 
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  borderRadius: '0.5rem'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No category data
          </div>
        )}
      </div>
    </div>
  );
};
