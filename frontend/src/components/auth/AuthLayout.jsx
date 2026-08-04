import React from 'react';
import { Sparkles, Code2, ShieldCheck, Zap } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* LEFT SIDE - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-muted/30 p-12 border-r border-border">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code2 className="h-5 w-5" />
          </div>
          CodeGuardian AI
        </div>

        <div className="space-y-8 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Review Pull Requests with AI
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Improve code quality instantly. Catch bugs before they reach production, enforce style guides, and dramatically speed up your review cycle.
          </p>

          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4 text-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <div className="font-medium">Lightning fast automated reviews</div>
            </div>
            <div className="flex items-center gap-4 text-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="font-medium">Enterprise-grade security scanning</div>
            </div>
            <div className="flex items-center gap-4 text-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="font-medium">Smart context-aware suggestions</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground font-medium">
          © {new Date().getFullYear()} CodeGuardian AI. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE - Auth Forms */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          {/* Mobile logo only visible on small screens */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8 text-xl font-bold tracking-tight text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Code2 className="h-5 w-5" />
            </div>
            CodeGuardian AI
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-card py-8 px-4 sm:rounded-2xl sm:px-10 sm:border sm:border-border sm:shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
