import { z } from 'zod';

export const PrintCutSchema = z.discriminatedUnion('hasPrintCut', [
	z.object({
		hasPrintCut: z.literal(true),
		printCut: z.object({
			description: z.string().nonempty({
				message: 'Description is required.',
			}),
			type: z.string().nonempty({
				message: 'Type is required.',
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
	z.object({ hasPrintCut: z.literal(false) }),
]);
