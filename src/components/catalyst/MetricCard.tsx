import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: string;
  change?: string;
}
export function MetricCard({ title, value, icon: Icon, color, change }: MetricCardProps) {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');
  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-5 w-5 text-muted-foreground", color)} />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{value}</div>
        {change && (
          <p className={cn(
            "text-xs text-muted-foreground mt-1",
            isPositive && "text-green-500",
            isNegative && "text-red-500"
          )}>
            {change} vs last simulation
          </p>
        )}
      </CardContent>
    </Card>
  );
}