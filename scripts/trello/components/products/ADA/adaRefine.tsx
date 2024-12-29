import { z } from 'zod';

const schema = z.object({
	productComponent: z.array(z.string()).optional(),
	productType: z
		.record(
			z.string(),
			z.object({
				title: z.string(),
				numberOfSigns: z.number().optional(),
				signs: z
					.array(
						z.object({
							details: z.string().optional(),
						})
					)
					.optional(),
			})
		)
		.optional(),
});

export const adaRefine = (
	data: z.infer<typeof schema>,
	ctx: z.RefinementCtx
) => {
	console.log('TEST');
	const productType =
		data.productType &&
		Object.values(data.productType).find(
			(type) => type.title === 'ADA Wayfinding'
		);

	console.log(data.productType);

	if (productType?.numberOfSigns && productType.numberOfSigns > 0) {
		for (let i = 0; i < productType.numberOfSigns; i++) {
			if (!productType.signs || !productType.signs[i]?.details) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['productType', i, 'details'],
					message: `Sign ${i + 1} details are required.`,
				});
			}
		}
	}
};
