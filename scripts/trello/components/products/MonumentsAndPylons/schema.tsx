import { z } from 'zod';

export const MonumentsAndPylonsSchema = z.discriminatedUnion(
	'hasMonumentsAndPylons',
	[
		z.object({
			hasMonumentsAndPylons: z.literal(true),
			monumentsAndPylons: z.object({
				numberOfSigns: z.string(),
				types: z.string().nonempty({
					message: 'Select atleast one type.',
				}),
				illumination: z.string().nonempty({
					message: 'Select atleast one illumination.',
				}),
				textAndContent: z.string().nonempty({
					message: 'Text and Content is required.',
				}),
				sides: z.string().nonempty(),
				dimensions: z.string().nonempty(),
				maxContentArea: z.string().nonempty(),
				minContentArea: z.string().nonempty(),
				maxGroundClearance: z.string().nonempty(),
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
		z.object({ hasMonumentsAndPylons: z.literal(false) }),
	]
);
