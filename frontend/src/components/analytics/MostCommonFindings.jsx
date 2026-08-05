import React from 'react';
import { AlertCircle } from 'lucide-react';

export const MostCommonFindings = ({ findings }) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      <div className="border-b border-border bg-muted/30 p-6">
        <h3 className="text-lg font-semibold text-foreground">Most Common Findings</h3>
        <p className="text-sm text-muted-foreground mt-1">Frequently recurring code issues</p>
      </div>
      
      <div className="p-0 flex-1 overflow-x-auto">
        {findings && findings.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium">Issue Description</th>
                <th className="px-6 py-3 font-medium text-right">Occurrences</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {findings.map((finding, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <span className="font-medium text-foreground line-clamp-2" title={finding.issue}>
                        {finding.issue}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center bg-secondary text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                      {finding.count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-muted-foreground text-sm">
            No common findings available.
          </div>
        )}
      </div>
    </div>
  );
};
