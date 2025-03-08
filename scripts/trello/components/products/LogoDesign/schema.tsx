import { z } from 'zod';

export const LogoDesignSchema = z.discriminatedUnion('hasLogoDesign', [
	z.object({
		hasLogoDesign: z.literal(true),
		logoDesign: z.object({
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
		hasLogoDesign: z.literal(false),
	}),
]);
