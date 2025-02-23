import { z } from 'zod';

export const ChannelLettersSchema = z.discriminatedUnion('hasChannelLetters', [
	z.object({
		hasChannelLetters: z.literal(true),
		channelLetters: z.object({
			numberOfSigns: z.string(),
			textAndContent: z.string().nonempty({
				message: 'Text and Content is required.',
			}),
			font: z.string().nonempty({
				message: 'Font required.',
			}),
			wallDimension: z.string().nonempty(),
			signDimension: z.string().nonempty(),
			material: z.string().nonempty(),
			trimCapColor: z.string().nonempty(),
			faceColor: z.string().nonempty(),
			returnColor: z.string().nonempty(),
			returnDepth: z.string().nonempty(),
			types: z.string().nonempty({
				message: 'Select atleast one type.',
			}),
			backer: z.string().nonempty({
				message: 'Select atleast one backer.',
			}),
			mounting: z.string().nonempty({
				message: 'Select atleast one mounting.',
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
		}),
	}),
	z.object({ hasChannelLetters: z.literal(false) }),
]);
