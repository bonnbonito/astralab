import { z } from 'zod';

export const ChannelLettersSchema = z.discriminatedUnion('hasChannelLetters', [
	z.object({
		hasChannelLetters: z.literal(true),
		channelLetters: z.object({
			numberOfSigns: z.string(),
			textAndContent: z.string().nonempty({
				message: 'Text and Content is required.',
			}),
			vendor: z.string().nonempty({
				message: 'Vendor required.',
			}),
			font: z.string().nonempty({
				message: 'Vendor required.',
			}),
			wallDimension: z.string().nonempty(),
			signDimension: z.string().nonempty(),
			material: z.string().nonempty(),
			trimCapColor: z.string().nonempty(),
			faceColor: z.string().nonempty(),
			returnColor: z.string().nonempty(),
			returnDepth: z.string().nonempty(),
			types: z.array(z.string()).min(1, {
				message: 'Select atleast one type.',
			}),
			backer: z.array(z.string()).min(1, {
				message: 'Select atleast one backer.',
			}),
			mounting: z.array(z.string()).min(1, {
				message: 'Select atleast one mounting.',
			}),
			designInspirations: z.array(z.string()),
		}),
	}),
	z.object({ hasChannelLetters: z.literal(false) }),
]);
