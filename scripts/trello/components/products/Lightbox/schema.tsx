import { z } from 'zod';

const lightboxBaseSchema = z.object({
	numberOfSigns: z.string().nonempty({
		message: 'Number of signs is required.',
	}),
	textAndContent: z.string().nonempty({
		message: 'Text and Content is required.',
	}),
	font: z.string().nonempty({
		message: 'Lightbox font required.',
	}),
	wallDimension: z.string().nonempty({
		message: 'Lightbox wall dimension is required.',
	}),
	signDimension: z.string().nonempty({
		message: 'Lightbox sign dimension is required.',
	}),
	depth: z.string().nonempty({
		message: 'Lightbox depth is required.',
	}),
	sides: z.string().nonempty({
		message: 'Lightbox sides is required.',
	}),
	color: z.string().nonempty({
		message: 'Lightbox color is required.',
	}),
	retainers: z.string().nonempty({
		message: 'Lightbox retainers is required.',
	}),
	types: z.array(z.string()).min(1, {
		message: 'Select at least one Lightbox type.',
	}),
	mounting: z.array(z.string()).min(1, {
		message: 'Select at least one Lightbox mounting.',
	}),
	designInspirations: z.array(z.string()).min(1, {
		message: 'Select at least one Lightbox design inspiration.',
	}),
});

export const LightboxSchema = z.discriminatedUnion('hasLightbox', [
	z.object({
		hasLightbox: z.literal(true),
		lightbox: lightboxBaseSchema,
	}),
	z.object({
		hasLightbox: z.literal(false),
	}),
]);

export type LightboxFormData = z.infer<typeof LightboxSchema>;
export type LightboxFields = z.infer<typeof lightboxBaseSchema>;
