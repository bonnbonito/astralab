import { z } from 'zod';

export const LightboxSchema = z.discriminatedUnion('hasLightbox', [
	z.object({
		hasLightbox: z.literal(true),
		lightbox: z.object({
			numberOfSigns: z.string(),
			textAndContent: z.string().nonempty({
				message: 'Text and Content is required.',
			}),
			font: z.string().nonempty({
				message: 'Font required.',
			}),
			wallDimension: z.string().nonempty(),
			signDimension: z.string().nonempty(),
			depth: z.string().nonempty(),
			sides: z.string().nonempty(),
			color: z.string().nonempty(),
			retainers: z.string().nonempty(),
			types: z.array(z.string()).min(1, {
				message: 'Select atleast one type.',
			}),
			mounting: z.array(z.string()).min(1, {
				message: 'Select atleast one mounting.',
			}),
			designInspirations: z.array(z.string()),
		}),
	}),
	z.object({ hasLightbox: z.literal(false) }),
]);
