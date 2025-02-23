import { z } from 'zod';

export const CustomJobSchema = z.object({
	hasCustomJob: z.boolean(),
	customJob: z
		.object({
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
				.min(1, {
					message: 'Select atleast one inspiration',
				}),
		})
		.optional(),
});
