import { z } from 'zod';

export const CustomJobSchema = z.discriminatedUnion('hasCustomJob', [
	z.object({
		hasCustomJob: z.literal(true),
		customJob: z.object({
			description: z.string().nonempty({
				message: 'Description is required.',
			}),
			designInspirations: z
				.array(
					z.object({
						title: z.string(),
						url: z.string(),
					})
				)
				.optional(),
		}),
	}),
	z.object({
		hasCustomJob: z.literal(false),
	}),
]);
