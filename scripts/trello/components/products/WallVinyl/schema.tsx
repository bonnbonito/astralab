import { z } from 'zod';

export const WallVinylSchema = z.discriminatedUnion('hasWallVinyl', [
	z.object({
		hasWallVinyl: z.literal(true),
		wallVinyl: z.object({
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
	z.object({ hasWallVinyl: z.literal(false) }),
]);
