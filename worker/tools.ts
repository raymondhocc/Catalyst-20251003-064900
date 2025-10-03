import type { WeatherResult, ErrorResult } from './types';
import { mcpManager } from './mcp-client';
export type ToolResult = WeatherResult | { content: string } | ErrorResult | Record<string, unknown>;
interface SerpApiResponse {
  knowledge_graph?: { title?: string; description?: string; source?: { link?: string } };
  answer_box?: { answer?: string; snippet?: string; title?: string; link?: string };
  organic_results?: Array<{ title?: string; link?: string; snippet?: string }>;
  local_results?: Array<{ title?: string; address?: string; phone?: string; rating?: number }>;
  error?: string;
}
const customTools = [
  {
    type: 'function' as const,
    function: {
      name: 'get_weather',
      description: 'Get current weather information for a location',
      parameters: {
        type: 'object',
        properties: { location: { type: 'string', description: 'The city or location name' } },
        required: ['location']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'web_search',
      description: 'Search the web using Google or fetch content from a specific URL',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query for Google search' },
          url: { type: 'string', description: 'Specific URL to fetch content from (alternative to search)' },
          num_results: { type: 'number', description: 'Number of search results to return (default: 5, max: 10)', default: 5 }
        },
        required: []
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_campaign_simulation',
      description: 'Simulates an e-commerce marketing campaign and returns projected performance metrics.',
      parameters: {
        type: 'object',
        properties: {
          campaignName: { type: 'string', description: 'The name of the campaign.' },
          budget: { type: 'number', description: 'The total budget for the campaign in USD.' },
          channels: { type: 'array', items: { type: 'string' }, description: 'A list of marketing channels to be used.' },
          promotionType: { type: 'string', description: 'The type of promotion being offered.' }
        },
        required: ['campaignName', 'budget', 'channels', 'promotionType']
      }
    }
  }
];
export async function getToolDefinitions() {
  const mcpTools = await mcpManager.getToolDefinitions();
  return [...customTools, ...mcpTools];
}
const createSearchUrl = (query: string, apiKey: string, numResults: number) => {
  const url = new URL('https://serpapi.com/search');
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('num', Math.min(numResults, 10).toString());
  return url.toString();
};
const formatSearchResults = (data: SerpApiResponse, query: string, numResults: number): string => {
  const results: string[] = [];
  if (data.knowledge_graph?.title && data.knowledge_graph.description) {
    results.push(`**${data.knowledge_graph.title}**\n${data.knowledge_graph.description}`);
    if (data.knowledge_graph.source?.link) results.push(`Source: ${data.knowledge_graph.source.link}`);
  }
  if (data.answer_box) {
    const { answer, snippet, title, link } = data.answer_box;
    if (answer) results.push(`**Answer**: ${answer}`);
    else if (snippet) results.push(`**${title || 'Answer'}**: ${snippet}`);
    if (link) results.push(`Source: ${link}`);
  }
  if (data.organic_results?.length) {
    results.push('\n**Search Results:**');
    data.organic_results.slice(0, numResults).forEach((result, index) => {
      if (result.title && result.link) {
        const text = [`${index + 1}. **${result.title}**`];
        if (result.snippet) text.push(`   ${result.snippet}`);
        text.push(`   Link: ${result.link}`);
        results.push(text.join('\n'));
      }
    });
  }
  if (data.local_results?.length) {
    results.push('\n**Local Results:**');
    data.local_results.slice(0, 3).forEach((result, index) => {
      if (result.title) {
        const text = [`${index + 1}. **${result.title}**`];
        if (result.address) text.push(`   Address: ${result.address}`);
        if (result.phone) text.push(`   Phone: ${result.phone}`);
        if (result.rating) text.push(`   Rating: ${result.rating} stars`);
        results.push(text.join('\n'));
      }
    });
  }
  return results.length ? `🔍 Search results for "${query}":\n\n${results.join('\n\n')}`
    : `No results found for "${query}". Try: https://www.google.com/search?q=${encodeURIComponent(query)}`;
};
async function performWebSearch(query: string, env: { SERPAPI_KEY?: string }, numResults = 5): Promise<string> {
  const apiKey = env.SERPAPI_KEY;
  if (!apiKey) {
    return `🔍 Web search requires a SERPAPI_KEY secret to be set.\nFallback: https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
  try {
    const response = await fetch(createSearchUrl(query, apiKey, numResults), {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WebBot/1.0)', 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error(`SerpAPI returned ${response.status}`);
    const data: SerpApiResponse = await response.json();
    if (data.error) throw new Error(`SerpAPI error: ${data.error}`);
    return formatSearchResults(data, query, numResults);
  } catch (error) {
    const isTimeout = error instanceof Error && error.message.includes('timeout');
    const fallback = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    return `Search failed: ${isTimeout ? 'timeout' : 'API error'}. Try: ${fallback}`;
  }
}
const extractTextFromHtml = (html: string): string => html
  .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
async function fetchWebContent(url: string): Promise<string> {
  try {
    new URL(url); // Validate
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WebBot/1.0)' },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/')) throw new Error('Unsupported content type');
    const html = await response.text();
    const text = extractTextFromHtml(html);
    return text.length ? `Content from ${url}:\n\n${text.slice(0, 4000)}${text.length > 4000 ? '...' : ''}`
      : `No readable content found at ${url}`;
  } catch (error) {
    throw new Error(`Failed to fetch: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
function simulateCampaign(args: { budget: number; channels: string[]; promotionType: string }): Record<string, unknown> {
  const { budget, channels, promotionType } = args;
  const baseROI = 1.2;
  const channelMultiplier = channels.length * 0.1 + (channels.includes('google') ? 0.15 : 0) + (channels.includes('email') ? 0.1 : 0);
  const promoMultiplier = promotionType === 'percentage_off' ? 1.1 : 1.0;
  const finalROI = (baseROI + channelMultiplier) * promoMultiplier;
  const projectedSales = budget * (1 + finalROI);
  const newCustomers = Math.floor(projectedSales / (Math.random() * 50 + 80));
  const cpa = newCustomers > 0 ? budget / newCustomers : 0;
  const metrics = [
    { title: "Estimated ROI", value: `${(finalROI * 100).toFixed(0)}%`, icon: "TrendingUp", color: "text-green-500", change: `+${(Math.random() * 10).toFixed(1)}%` },
    { title: "Projected Sales", value: `$${projectedSales.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, icon: "DollarSign", color: "text-indigo-500", change: `+${(Math.random() * 15).toFixed(1)}%` },
    { title: "Target CPA", value: `$${cpa.toFixed(2)}`, icon: "Target", color: "text-orange-500", change: `-${(Math.random() * 5).toFixed(1)}%` },
    { title: "Est. New Customers", value: newCustomers.toLocaleString(), icon: "Users", color: "text-sky-500", change: `+${(Math.random() * 12).toFixed(1)}%` },
  ];
  const salesForecast = Array.from({ length: 12 }, (_, i) => ({
    name: `Week ${i + 1}`,
    sales: Math.floor(projectedSales / 12 * (1 + (i / 11 - 0.5) * 0.8) * (Math.random() * 0.2 + 0.9)),
  }));
  const channelPerformance = [
    { name: "Google Ads", performance: Math.floor(Math.random() * 20 + 80), fill: "hsl(var(--chart-1))" },
    { name: "Facebook", performance: Math.floor(Math.random() * 20 + 75), fill: "hsl(var(--chart-2))" },
    { name: "Instagram", performance: Math.floor(Math.random() * 20 + 70), fill: "hsl(var(--chart-3))" },
    { name: "Email", performance: Math.floor(Math.random() * 20 + 78), fill: "hsl(var(--chart-4))" },
    { name: "Organic", performance: Math.floor(Math.random() * 20 + 60), fill: "hsl(var(--chart-5))" },
  ].filter(c => channels.some(inputChannel => c.name.toLowerCase().includes(inputChannel)));
  const aiRecommendations = `With a budget of $${budget.toLocaleString()} and focusing on ${channels.join(', ')}, the simulation projects a strong ROI of ${ (finalROI * 100).toFixed(0)}%. The '${promotionType.replace('_', ' ')}' promotion is effective. Suggestion: Allocate more budget towards top-performing channels like Google Ads to potentially boost sales by another 5-10%.`;
  return { metrics, salesForecast, channelPerformance, aiRecommendations };
}
export async function executeTool(name: string, args: Record<string, unknown>, env: { SERPAPI_KEY?: string } = {}): Promise<ToolResult> {
  try {
    switch (name) {
      case 'get_weather':
        return {
          location: args.location as string,
          temperature: Math.floor(Math.random() * 40) - 10,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 100)
        };
      case 'web_search': {
        const { query, url, num_results = 5 } = args;
        if (typeof url === 'string') {
          const content = await fetchWebContent(url);
          return { content };
        }
        if (typeof query === 'string') {
          const content = await performWebSearch(query, env, num_results as number);
          return { content };
        }
        return { error: 'Either query or url parameter is required' };
      }
      case 'get_campaign_simulation':
        return simulateCampaign(args as { budget: number; channels: string[]; promotionType: string });
      default: {
        const content = await mcpManager.executeTool(name, args);
        return { content };
      }
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}