import { z } from 'zod';

const DOMAIN_REGEX = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export const settingsSchema = z.object({
  apiKey: z
    .string()
    .min(1, 'API Key is required')
    .min(8, 'API Key must be at least 8 characters')
    .trim(),
  model: z.enum(['fast', 'balanced', 'pro'] as const),
  topK: z
    .number({ message: 'Top-K results must be a valid number' })
    .int('Top-K results must be a whole integer')
    .min(1, 'Top-K results must be at least 1')
    .max(100, 'Top-K results cannot exceed 100'),
  minScore: z
    .number({ message: 'Minimum score must be a number' })
    .min(0, 'Minimum score threshold cannot be less than 0.0')
    .max(1, 'Minimum score threshold cannot exceed 1.0'),
  domainFilter: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || DOMAIN_REGEX.test(val),
      'Please enter a valid domain format (e.g., example.com)'
    ),
  autoRerank: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export const defaultSettings: SettingsFormData = {
  apiKey: '',
  model: 'balanced',
  topK: 10,
  minScore: 0.7,
  domainFilter: '',
  autoRerank: true,
};
