import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { promotionTypes, marketingChannels } from "@/lib/mockData";
import { Wand2, Loader2 } from "lucide-react";
import { useSimulationStore } from "@/hooks/use-simulation-store";
const formSchema = z.object({
  campaignName: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  budget: z.number().min(1000).max(1000000),
  channels: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one channel.",
  }),
  promotionType: z.string().nonempty({
    message: "Please select a promotion type.",
  }),
});
type FormValues = z.infer<typeof formSchema>;
export function CampaignInputForm() {
  const [budget, setBudget] = useState(50000);
  const runSimulation = useSimulationStore((state) => state.runSimulation);
  const isSimulating = useSimulationStore((state) => state.isSimulating);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignName: "Q3 Marketing Push",
      budget: 50000,
      channels: ["google", "facebook"],
      promotionType: "percentage_off",
    },
  });
  function onSubmit(values: FormValues) {
    runSimulation(values);
  }
  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Campaign Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="campaignName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Sale 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Budget</FormLabel>
                  <FormControl>
                    <>
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                        }).format(budget)}
                      </div>
                      <Slider
                        defaultValue={[budget]}
                        max={1000000}
                        min={1000}
                        step={1000}
                        onValueChange={(value) => {
                          setBudget(value[0]);
                          field.onChange(value[0]);
                        }}
                        className="py-2"
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channels"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Marketing Channels
                    </FormLabel>
                    <FormDescription>
                      Select the channels for your campaign.
                    </FormDescription>
                  </div>
                  <div className="space-y-3">
                    {marketingChannels.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="channels"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center gap-2">
                                <item.icon className="w-4 h-4 text-muted-foreground" />
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promotionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a promotion" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {promotionTypes.map((promo) => (
                        <SelectItem key={promo.value} value={promo.value}>
                          {promo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg py-6 transition-all duration-300 transform hover:scale-105"
              disabled={isSimulating}
            >
              {isSimulating ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-5 w-5" />
              )}
              {isSimulating ? "Simulating..." : "Simulate Campaign"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}