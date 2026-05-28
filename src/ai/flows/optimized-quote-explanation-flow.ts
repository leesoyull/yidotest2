'use server';
/**
 * @fileOverview This file implements a Genkit flow for providing clear, easy-to-understand explanations of preliminary repair quotes
 * and suggesting potential alternative materials or methods to optimize cost or durability.
 *
 * - optimizedQuoteExplanation - A function that handles the quote explanation and optimization process.
 * - OptimizedQuoteInput - The input type for the optimizedQuoteExplanation function.
 * - OptimizedQuoteOutput - The return type for the optimizedQuoteExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const OptimizedQuoteInputSchema = z.object({
  quoteDescription: z.string().describe('A detailed description of the preliminary repair quote, including items, costs, and current materials/methods.')
});
export type OptimizedQuoteInput = z.infer<typeof OptimizedQuoteInputSchema>;

// Output Schema
const OptimizedQuoteOutputSchema = z.object({
  explanation: z.string().describe('A clear, easy-to-understand explanation of the provided quote breakdown.'),
  alternativeSuggestions: z.array(
    z.object({
      type: z.enum(['material', 'method']).describe('The type of alternative suggestion.'),
      name: z.string().describe('The name or brief identifier of the alternative.'),
      description: z.string().describe('A detailed explanation of the alternative, its benefits, and why it could optimize cost or durability.'),
      impact: z.string().describe('Estimated impact of the alternative (e.g., "Significant Cost Reduction", "Increased Durability by X years").')
    })
  ).describe('A list of potential alternative materials or methods to optimize cost or durability, with explanations.')
});
export type OptimizedQuoteOutput = z.infer<typeof OptimizedQuoteOutputSchema>;

// Prompt definition
const optimizedQuotePrompt = ai.definePrompt({
  name: 'optimizedQuotePrompt',
  input: {schema: OptimizedQuoteInputSchema},
  output: {schema: OptimizedQuoteOutputSchema},
  prompt: `You are an expert in building maintenance, repair, and cost optimization.
Your task is to analyze a preliminary repair quote description and provide two main things:
1. A clear, easy-to-understand explanation of the quote breakdown.
2. Actionable suggestions for alternative materials or methods that could optimize cost or durability.

Here is the preliminary quote description:
{{{quoteDescription}}}

Based on this, first provide a clear and concise explanation of what the quote covers, why certain items are included, and what the current proposed materials/methods entail, suitable for a building owner with no technical background.
Second, suggest at least 2-3 potential alternative materials or methods that could either reduce the overall cost or significantly enhance the durability of the repair. For each suggestion, describe its benefits and the estimated impact.`
});

// Flow definition
const optimizedQuoteExplanationFlow = ai.defineFlow(
  {
    name: 'optimizedQuoteExplanationFlow',
    inputSchema: OptimizedQuoteInputSchema,
    outputSchema: OptimizedQuoteOutputSchema
  },
  async (input) => {
    const {output} = await optimizedQuotePrompt(input);
    if (!output) {
      throw new Error("Failed to generate optimized quote explanation.");
    }
    return output;
  }
);

// Wrapper function
export async function optimizedQuoteExplanation(input: OptimizedQuoteInput): Promise<OptimizedQuoteOutput> {
  return optimizedQuoteExplanationFlow(input);
}
