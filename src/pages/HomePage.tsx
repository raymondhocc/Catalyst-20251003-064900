import { Header } from "@/components/catalyst/Header";
import { CampaignInputForm } from "@/components/catalyst/CampaignInputForm";
import { SimulationOutput } from "@/components/catalyst/SimulationOutput";
import { HistoricalDataTable } from "@/components/catalyst/HistoricalDataTable";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";
export function HomePage() {
  const isSimulating = useSimulationStore((state) => state.isSimulating);
  const error = useSimulationStore((state) => state.error);
  useEffect(() => {
    if (error) {
      toast.error("Simulation Failed", {
        description: error,
      });
    }
  }, [error]);
  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <Header />
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-1">
              <CampaignInputForm />
            </div>
            <div className="lg:col-span-2 space-y-16">
              <SimulationOutput />
              <div className="space-y-12">
                <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                  Contextual Data
                </h2>
                <HistoricalDataTable />
              </div>
            </div>
          </div>
        </main>
        <footer className="py-8 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400">
            <p>Built with ❤️ at Cloudflare</p>
            <p className="text-xs mt-2">
              Note: AI capabilities are enabled for this application. However, for security, API keys are not provided in this preview. To use the AI features, please export the project and deploy it with your own credentials.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}