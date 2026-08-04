import * as React from "react"
import { cn } from "../../lib/utils"

import { Loader2 } from "lucide-react"

const Button = React.forwardRef(({ className, variant = "default", size = "default", isLoading = false, children, ...props }, ref) => {
  const Comp = "button"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02]",
    outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-12 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-14 rounded-lg px-8 text-base",
    icon: "h-12 w-12",
  }

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Comp>
  )
})
Button.displayName = "Button"

export { Button }
