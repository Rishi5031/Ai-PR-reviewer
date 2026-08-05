import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

export const HealthCharts = ({ trends, severity, categories }) => {
  // Format trend data
  const trendData = trends.map(t => ({
    date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: t.average_review_score
  }));

  // Format severity data
  const severityData = [
    { name: 'Critical', value: severity.critical, color: '#ef4444' },
    { name: 'High', value: severity.high, color: '#f97316' },
    { name: 'Medium', value: severity.medium, color: '#eab308' },
    { name: 'Low', value: severity.low, color: '#3b82f6' }
  ].filter(s => s.value > 0);

  // Format category data
  const categoryData = Object.entries(categories).map(([key, score]) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: score
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Score Trend */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm col-span-1 lg:col-span-2">
        <h3 className="text-lg font-semibold text-foreground mb-6">AI Score Trend</h3>
        <div className="h-[300px]">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888' }} />
                <YAxis domain={[0, 100]} stroke="#666" tick={{ fill: '#888' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">Not enough data for trends.</div>
          )}
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">Severity Distribution</h3>
        <div className="h-[300px]">
          {severityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">No severity data available.</div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">Category Scores</h3>
        <div className="h-[300px]">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 10]} stroke="#666" tick={{ fill: '#888' }} />
                <YAxis dataKey="name" type="category" stroke="#666" tick={{ fill: '#888' }} width={120} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                />
                <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">No category data available.</div>
          )}
        </div>
      </div>
    </div>
  );
};
