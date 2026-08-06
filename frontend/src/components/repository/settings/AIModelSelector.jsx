import React from 'react';
import { Bot, ChevronDown, Check } from 'lucide-react';

export const AIModelSelector = ({ value, onChange }) => {
  const models = [
    { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', desc: 'Next-generation speed and quality' },
    { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', desc: 'Latest flash model' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Fast and cost-effective' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Maximum reasoning power' },
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', desc: 'Lowest latency' }
  ];

  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedModel = models.find(m => m.id === value) || models[0];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5">
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          AI Model
        </label>
        <p className="text-sm text-muted-foreground mt-1">Select which AI model will review this repository.</p>
      </div>

      <div className="relative w-full md:w-[320px] shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-background border border-border rounded-md text-sm shadow-sm hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <div className="flex flex-col items-start text-left">
            <span className="font-medium text-foreground leading-none mb-1">{selectedModel.name}</span>
            <span className="text-xs text-muted-foreground">{selectedModel.desc}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <ul className="py-1">
              {models.map((model) => (
                <li key={model.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(model.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm hover:bg-muted transition-colors ${
                      value === model.id ? 'bg-primary/10 text-primary' : 'text-foreground'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium mb-0.5">{model.name}</span>
                      <span className={`text-[10px] leading-tight ${value === model.id ? 'text-primary/70' : 'text-muted-foreground'}`}>
                        {model.desc}
                      </span>
                    </div>
                    {value === model.id && <Check className="w-4 h-4 shrink-0 ml-2" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
