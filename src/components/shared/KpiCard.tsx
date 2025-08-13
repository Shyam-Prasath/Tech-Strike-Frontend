import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function KpiCard({ title, value, subtitle, icon, trend, className }: KpiCardProps) {
  return (
    <div className={cn(
      "bg-gradient-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className={cn(
              "text-sm font-medium",
              trend === 'up' && "text-success",
              trend === 'down' && "text-destructive",
              trend === 'neutral' && "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}