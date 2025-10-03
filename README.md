# Catalyst AI: E-Commerce Campaign Simulator

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/Catalyst-20251003-064900)

Catalyst AI is a sophisticated, AI-driven web application designed for e-commerce marketing professionals. It provides a stunning, intuitive dashboard to simulate marketing campaign performance. Users can input various campaign parameters such as budget, channel mix, and promotional mechanics. The application leverages a Cloudflare Agent to process this information, analyze mocked historical data, and generate predictive analytics. The results, including estimated ROI, projected sales, and channel effectiveness, are presented through beautiful, interactive data visualizations and clear, actionable recommendations, enabling marketers to make data-informed decisions and optimize their strategies before launch.

## ✨ Key Features

- **AI-Powered Simulation:** Leverage AI to forecast campaign outcomes based on your inputs.
- **Interactive Dashboard:** A single-page, intuitive interface for seamless campaign planning.
- **Predictive Analytics:** Get data-driven estimates for ROI, sales projections, and more.
- **Rich Data Visualizations:** Understand complex data through beautiful, easy-to-read charts.
- **Historical Performance Context:** Analyze past campaign data to inform future strategies.
- **Serverless Architecture:** Built on the high-performance, scalable Cloudflare stack.

## 🛠️ Technology Stack

- **Frontend:**
  - [React](https://react.dev/)
  - [Vite](https://vitejs.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)
  - [Recharts](https://recharts.org/)
  - [Framer Motion](https://www.framer.com/motion/)
  - [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend:**
  - [Cloudflare Workers](https://workers.cloudflare.com/)
  - [Hono](https://hono.dev/)
  - [Cloudflare Agents](https://developers.cloudflare.com/workers/agents/)
- **AI:**
  - [OpenAI](https://openai.com/) via Cloudflare AI Gateway

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/catalyst_ai.git
    cd catalyst_ai
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.dev.vars` file in the root of the project and add your Cloudflare AI Gateway credentials.

    ```ini
    # .dev.vars

    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="YOUR_CLOUDFLARE_API_KEY"
    ```

    > **Note:** The AI agent will not function without valid Cloudflare credentials.

## 💻 Development

To start the local development server, which includes the Vite frontend and the Cloudflare Worker backend, run:

```bash
bun run dev
```

This will start the application on `http://localhost:3000` (or the next available port). The frontend will automatically reload when you make changes to the source files.

## 📈 Usage

Once the application is running, you can interact with the dashboard:

1.  **Navigate** to the application in your browser.
2.  On the left-hand side, use the **Campaign Simulation** form to input your desired campaign parameters (e.g., budget, channels, promotion type).
3.  Click the **"Simulate Campaign"** button.
4.  The right-hand side of the dashboard will update to display the AI-generated forecast, including key metrics, charts, and actionable recommendations.
5.  Scroll down to view the **Historical Campaign Data** table for additional context.

## ☁️ Deployment

This project is designed for seamless deployment to Cloudflare Pages.

1.  **Log in to Cloudflare:**
    Make sure you have the `wrangler` CLI installed and authenticated with your Cloudflare account.
    ```bash
    bunx wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the application and deploy it to your Cloudflare account.
    ```bash
    bun run deploy
    ```

3.  **Configure Environment Variables:**
    After deployment, navigate to your project's settings in the Cloudflare dashboard (`Settings` > `Functions` > `Durable Object Bindings`) and add the `CF_AI_BASE_URL` and `CF_AI_API_KEY` environment variables to your production environment.

Alternatively, deploy directly from your GitHub repository:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/Catalyst-20251003-064900)

## 📂 Project Structure

-   `src/`: Contains all the frontend source code, including React components, pages, styles, and utility functions.
-   `worker/`: Contains the backend Cloudflare Worker source code, including the Hono router, Cloudflare Agent logic, and AI integration.
-   `public/`: Static assets that are served directly.
-   `wrangler.jsonc`: Configuration file for the Cloudflare Worker.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.