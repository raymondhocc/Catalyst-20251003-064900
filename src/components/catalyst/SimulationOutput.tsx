import { motion, AnimatePresence, Transition } from "framer-motion";
import { Lightbulb, Info } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { SalesForecastChart } from "./SalesForecastChart";
import { ChannelPerformanceChart } from "./ChannelPerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
export function SimulationOutput() {
  const isSimulating = useSimulationStore((state) => state.isSimulating);
  const simulationResult = useSimulationStore(
    (state) => state.simulationResult
  );
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      } as Transition,
    },
  };
  const Skeletons = () => (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-3 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
  const WelcomeMessage = () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Ready to Simulate!</AlertTitle>
      <AlertDescription>
        Fill out the campaign details on the left and click "Simulate Campaign"
        to see the AI-powered forecast.
      </AlertDescription>
    </Alert>
  );
  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
        AI-Generated Simulation & Forecast
      </h2>
      <AnimatePresence mode="wait">
        {isSimulating ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Skeletons />
          </motion.div>
        ) : !simulationResult ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WelcomeMessage />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {simulationResult.metrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
              ))}
            </motion.div>
            <motion.div variants={itemVariants}>
              <SalesForecastChart data={simulationResult.salesForecast} />
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div variants={itemVariants}>
                <ChannelPerformanceChart
                  data={simulationResult.channelPerformance}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-orange-500" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {simulationResult.aiRecommendations}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}