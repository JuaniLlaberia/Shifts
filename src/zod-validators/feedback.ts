import { z } from 'zod';

export const createFeedbackValidator = z.object({
  feedback: z.string(),
});
