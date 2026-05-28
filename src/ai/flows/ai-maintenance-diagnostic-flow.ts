'use server';
/**
 * @fileOverview An AI agent that provides instant assessment and repair suggestions for building maintenance issues.
 *
 * - aiMaintenanceDiagnostic - A function that handles the maintenance diagnostic process.
 * - AiMaintenanceDiagnosticInput - The input type for the aiMaintenanceDiagnostic function.
 * - AiMaintenanceDiagnosticOutput - The return type for the aiMaintenanceDiagnostic function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiMaintenanceDiagnosticInputSchema = z.object({
  issueDescription: z.string().describe("A natural language description of the building's maintenance issue (e.g., 'There's a crack in my basement wall and water is seeping in')."),
});
export type AiMaintenanceDiagnosticInput = z.infer<typeof AiMaintenanceDiagnosticInputSchema>;

const AiMaintenanceDiagnosticOutputSchema = z.object({
  likelyCause: z.string().describe("The most likely cause of the described building maintenance issue."),
  suggestedRepairProcedures: z.array(z.string()).describe("A list of initial repair procedures or steps to address the issue."),
});
export type AiMaintenanceDiagnosticOutput = z.infer<typeof AiMaintenanceDiagnosticOutputSchema>;

export async function aiMaintenanceDiagnostic(input: AiMaintenanceDiagnosticInput): Promise<AiMaintenanceDiagnosticOutput> {
  return aiMaintenanceDiagnosticFlow(input);
}

const aiMaintenanceDiagnosticPrompt = ai.definePrompt({
  name: 'aiMaintenanceDiagnosticPrompt',
  input: { schema: AiMaintenanceDiagnosticInputSchema },
  output: { schema: AiMaintenanceDiagnosticOutputSchema },
  prompt: `You are an expert in building maintenance and diagnostics. Your task is to provide an instant assessment of a building issue and suggest initial repair procedures based on the user's description.

User's Description of the Issue: {{{issueDescription}}}

Based on the description, identify the most likely cause and outline step-by-step initial repair procedures.`,
});

const aiMaintenanceDiagnosticFlow = ai.defineFlow(
  {
    name: 'aiMaintenanceDiagnosticFlow',
    inputSchema: AiMaintenanceDiagnosticInputSchema,
    outputSchema: AiMaintenanceDiagnosticOutputSchema,
  },
  async (input) => {
    const { output } = await aiMaintenanceDiagnosticPrompt(input);
    return output!;
  }
);
