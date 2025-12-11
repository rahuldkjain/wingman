import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="w-[400px] min-h-[500px] bg-background p-4 font-sans text-foreground">
      <header className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-primary">
            <img
              src="/wingman-logo.png"
              alt="Wingman logo"
              className="w-32 h-auto"
            />
          </h1>
        </div>
        <span className="text-xs text-muted-foreground">
          Flight Search Assistant
        </span>
      </header>
      <main className="space-y-6">{children}</main>
    </div>
  );
}
