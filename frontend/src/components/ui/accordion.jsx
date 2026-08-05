import React, { createContext, useContext, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const AccordionContext = createContext({});

export const Accordion = ({ type = "single", collapsible = true, defaultValue, children, className }) => {
  const [openItems, setOpenItems] = useState(
    defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
  );

  const toggleItem = (value) => {
    if (type === "single") {
      setOpenItems((prev) => (prev.includes(value) && collapsible ? [] : [value]));
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("space-y-1", className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

const AccordionItemContext = createContext({});

export const AccordionItem = ({ value, children, className }) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn("border-b border-border/50", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

export const AccordionTrigger = ({ children, className, onClick, ...props }) => {
  const { openItems, toggleItem } = useContext(AccordionContext);
  const { value } = useContext(AccordionItemContext);
  const isOpen = openItems.includes(value);

  return (
    <button
      onClick={(e) => {
        toggleItem(value);
        if (onClick) onClick(e);
      }}
      className={cn(
        "flex flex-1 items-center justify-between w-full py-4 font-medium transition-all hover:bg-secondary/20 rounded-md px-2",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
};

export const AccordionContent = ({ children, className }) => {
  const { openItems } = useContext(AccordionContext);
  const { value } = useContext(AccordionItemContext);
  const isOpen = openItems.includes(value);

  return (
    <div
      className={cn(
        "grid transition-all duration-300 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <div className={cn("pb-4 pt-0 px-2", className)}>{children}</div>
      </div>
    </div>
  );
};
