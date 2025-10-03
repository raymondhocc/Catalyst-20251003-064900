import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import type { ChannelPerformanceDataPoint } from "@/lib/types";
interface ChannelPerformanceChartProps {
  data: ChannelPerformanceDataPoint[];
}
export function ChannelPerformanceChart({
  data,
}: ChannelPerformanceChartProps) {
  const { isDark } = useTheme();
  const themeColor = isDark ? "#f8fafc" : "#0f172a";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel Performance Index</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis
                dataKey="name"
                stroke={themeColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={themeColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark
                    ? "hsl(222.2 84% 4.9%)"
                    : "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: themeColor }}
                formatter={(value: number, name: string) => [
                  value,
                  "Performance",
                ]}
              />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Bar dataKey="performance" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}