import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  TrendingUp,
  DollarSign,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import type {
  SimulationInput,
  SimulationResult,
  SimulationMetric,
} from "@/lib/types";
async function fetchSimulationFromAgent(
  input: SimulationInput
): Promise<SimulationResult> {
  const prompt = `
    Simulate an e-commerce campaign with the following parameters:
    - Name: "${input.campaignName}"
    - Budget: ${input.budget}
    - Channels: ${input.channels.join(", ")}
    - Promotion: ${input.promotionType}
    Return ONLY the raw JSON output from the get_campaign_simulation tool. Do not add any commentary or formatting.
  `;
  const sessionId = crypto.randomUUID();
  const response = await fetch(`/api/chat/${sessionId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: prompt }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch simulation: ${errorText}`);
  }
  const result = await response.json();
  try {
    const lastMessage = result.data.messages[result.data.messages.length - 1];
    const simulationData = JSON.parse(lastMessage.content);
    const iconMap: { [key: string]: LucideIcon } = {
      TrendingUp,
      DollarSign,
      Target,
      Users,
    };
    simulationData.metrics = simulationData.metrics.map(
      (metric: SimulationMetric & { icon: string }) => ({
        ...metric,
        icon: iconMap[metric.icon] || TrendingUp,
      })
    );
    return simulationData;
  } catch (e) {
    console.error("Failed to parse AI response:", e, result);
    throw new Error("The AI returned an invalid response format.");
  }
}
interface SimulationState {
  simulationInput: SimulationInput | null;
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  error: string | null;
}
interface SimulationActions {
  runSimulation: (input: SimulationInput) => Promise<void>;
}
export const useSimulationStore = create<SimulationState & SimulationActions>()(
  immer((set) => ({
    simulationInput: null,
    simulationResult: null,
    isSimulating: false,
    error: null,
    runSimulation: async (input) => {
      set((state) => {
        state.isSimulating = true;
        state.simulationInput = input;
        state.error = null;
      });
      try {
        const result = await fetchSimulationFromAgent(input);
        set((state) => {
          state.simulationResult = result;
          state.isSimulating = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : "An unknown error occurred.";
          state.isSimulating = false;
        });
      }
    },
  }))
);