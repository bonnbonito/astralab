import { z } from 'zod';

export const projectDetailsSchema = {
	turnaroundTime: z.string().nonempty({
		message: 'Turnaround Time is required.',
	}),
	designDetails: z.string().optional(),
	projectDescription: z.string().nonempty({
		message: 'Project Description is required.',
	}),
	layoutType: z.string().nonempty({ message: 'Layout Type is required.' }),
	productType: z.record(z.object({ title: z.string() })).optional(),
	productComponent: z.array(z.string()).optional(),
	productId: z.array(z.number()).optional(),
	fileUpload: z.array(z.instanceof(File)).nonempty({
		message: 'Files are required.',
	}),
};
