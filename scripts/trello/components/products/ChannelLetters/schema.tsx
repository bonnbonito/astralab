import { z } from 'zod';

export const ChannelLettersSchema = z.discriminatedUnion('hasChannelLetters', [
	z.object({
		hasChannelLetters: z.literal(true),
		channelLetters: z.object({
			numberOfSigns: z.string(),
			textAndContent: z.string().optional(),
			font: z.string().optional(),
			wallDimension: z.string().optional(),
			signDimension: z.string().optional(),
			material: z.string().optional(),
			trimCapColor: z.string().optional(),
			faceColor: z.string().optional(),
			returnColor: z.string().optional(),
			returnDepth: z.string().optional(),
			types: z.string().optional(),
			backer: z.string().optional(),
			mounting: z.string().optional(),
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
	z.object({ hasChannelLetters: z.literal(false) }),
]);
