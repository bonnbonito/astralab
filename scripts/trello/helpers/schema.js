import { z } from 'zod';

export const projectDetailsSchema = {
	turnaroundTime: z.string().optional(),
	designDetails: z.string().optional(),
	projectDescription: z.string().nonempty({
		message: 'Project Description is required.',
	}),
	layoutType: z.string().nonempty({ message: 'Layout Type is required.' }),
	productType: z
		.array(z.string())
		.nonempty({ message: 'Product Type is required.' }),
	fileUpload: z.array(z.instanceof(File)).nonempty({
		message: 'Files are required.',
	}),
};
