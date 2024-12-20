import { z } from 'zod';

const schema = z.object({
	turnaroundTime: z.string(),
	designDetails: z.string().optional(),
});

// Define the refine function
export const exampleRefine = (
	data: z.infer<typeof schema>,
	ctx: z.RefinementCtx
) => {
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
};
