import { z } from 'zod';

export const ADASchema = z.discriminatedUnion('hasADA', [
	z.object({
		hasADA: z.literal(true),
		ADA: z.object({
			numberOfSigns: z.string(),
			signs: z.array(
				z.object({
					name: z.string().nonempty(),
					dimension: z.string().nonempty(),
					details: z.string().nonempty(),
				})
			),
			types: z.array(z.string()).min(1, {
				message: 'Select atleast one type.',
			}),
			designInspirations: z.array(z.string()),
		}),
	}),
	z.object({ hasADA: z.literal(false) }),
]);
