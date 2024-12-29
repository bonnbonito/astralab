import { z } from 'zod';

// Update schema to match the `productType` type
const schema = z.object({
	turnaroundTime: z.string().nonempty({
		message: 'Turn Around Time is required.',
	}),
	designDetails: z.string().optional(),
	productType: z.record(z.string(), z.object({ title: z.string() })).optional(), // Matches Record<string, { title: string }>
});

// Update exampleRefine to handle the new structure
export const exampleRefine = (
	data: z.infer<typeof schema>,
	ctx: z.RefinementCtx
) => {
	// Example refinement for turnaroundTime
	if (
		data.turnaroundTime === 'option3' &&
		(!data.designDetails || data.designDetails === '')
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['designDetails'],
			message: 'Design Details are required when Turn Around Time is option3.',
		});
	}

	// Example refinement for productType
	if (!data.productType || Object.keys(data.productType).length === 0) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['productType'],
			message: 'Product Type is required.',
		});
	}
};
