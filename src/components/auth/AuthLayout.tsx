import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Tech-Strike
          </h1>
          <p className="text-muted-foreground">Pool Consultant Management System</p>
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          {children}
        </div>
      </div>
    </div>
  );
}