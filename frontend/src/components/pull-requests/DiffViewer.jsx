import React from 'react';

export const DiffViewer = ({ patch }) => {
  if (!patch) return <div className="p-4 text-sm text-muted-foreground italic">No diff available (e.g., binary file or too large).</div>;

  const lines = patch.split('\n');

  return (
    <div className="overflow-x-auto bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] leading-5 rounded-b-lg">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, index) => {
            let rowClass = 'hover:bg-white/5 transition-colors';
            let numClass = 'text-gray-500 border-r border-white/10 px-2 py-0.5 select-none w-12 text-right opacity-50';
            
            if (line.startsWith('+')) {
              rowClass = 'bg-[#1e3a29] hover:bg-[#254832] text-[#86d79a]';
              numClass = 'text-[#86d79a] border-r border-white/10 px-2 py-0.5 select-none w-12 text-right opacity-80';
            } else if (line.startsWith('-')) {
              rowClass = 'bg-[#4d1f24] hover:bg-[#5f252b] text-[#f48771]';
              numClass = 'text-[#f48771] border-r border-white/10 px-2 py-0.5 select-none w-12 text-right opacity-80';
            } else if (line.startsWith('@@')) {
              rowClass = 'bg-[#252526] text-[#569cd6] font-semibold';
            }

            return (
              <tr key={index} className={rowClass}>
                <td className={numClass}>{index + 1}</td>
                <td className="pl-4 pr-4 py-0.5 whitespace-pre break-words break-all" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                  {line}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
