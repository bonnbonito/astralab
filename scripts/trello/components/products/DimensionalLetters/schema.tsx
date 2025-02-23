import { z } from 'zod';

export const DimensionalLettersSchema = z.discriminatedUnion(
	'hasDimensionalLetters',
	[
		z.object({
			hasDimensionalLetters: z.literal(true),
			dimensionalLetters: z.object({
				numberOfSigns: z.string(),
				textAndContent: z.string().nonempty({
					message: 'Text and Content is required.',
				}),
				font: z.string().nonempty({
					message: 'Font required.',
				}),
				wallDimension: z.string().nonempty(),
				signDimension: z.string().nonempty(),
				sides: z.string().nonempty(),
				backPanel: z.string().nonempty(),
				location: z.string().nonempty(),
				types: z.string().nonempty({
					message: 'Select atleast one type.',
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
		z.object({ hasDimensionalLetters: z.literal(false) }),
	]
);
