import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { historicalCampaigns } from "@/lib/mockData";
import { cn } from "@/lib/utils";
export function HistoricalDataTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Campaign Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead className="text-right">Sales</TableHead>
              <TableHead className="text-right">ROI</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historicalCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(campaign.budget)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {campaign.channels.map((channel) => (
                      <Badge key={channel} variant="secondary">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(campaign.sales)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-semibold",
                    campaign.roi >= 150 ? "text-green-500" : "text-amber-500"
                  )}
                >
                  {campaign.roi}%
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={cn(
                      campaign.status === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-slate-100 text-slate-800"
                    )}
                  >
                    {campaign.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}