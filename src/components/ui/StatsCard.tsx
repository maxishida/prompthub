
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  className,
  valueClassName,
  onClick,
}: StatsCardProps) {
  const formattedTrend = trend !== undefined ? (trend > 0 ? `+${trend.toFixed(2)}%` : `${trend.toFixed(2)}%`) : null;
  const isTrendPositive = trend !== undefined ? trend > 0 : null;
  
  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-md overflow-hidden",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight truncate" style={{ lineHeight: '1.5' }}>
          <span className={valueClassName}>{value}</span>
        </div>
        
        {(description || trend !== undefined) && (
          <div className="flex items-center text-xs mt-1">
            {trend !== undefined && (
              <span className={cn(
                "inline-flex items-center mr-1",
                isTrendPositive ? "text-success" : "text-danger"
              )}>
                {isTrendPositive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                {formattedTrend}
              </span>
            )}
            {trendLabel && <span className="text-muted-foreground ml-1">{trendLabel}</span>}
            {description && (
              <p className={cn("text-muted-foreground", trend !== undefined ? "ml-2" : "")}>
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
