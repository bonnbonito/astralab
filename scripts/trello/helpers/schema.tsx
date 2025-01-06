import { z } from 'zod';

import { ADASchema } from '../components/products/ADA/schema';

const formSchema = z
	.object({
		projectName: z.string().min(2).nonempty(),
		turnaroundTime: z
			.string()
			.nonempty({ message: 'Turnaround Time is required.' }),
		designDetails: z.string().nonempty(),
		projectDescription: z
			.string()
			.nonempty({ message: 'Project Description is required.' }),
		layoutType: z.string().nonempty({ message: 'Layout Type is required.' }),
		productTypes: z
			.array(
				z.object({
					title: z.string().nonempty(),
					component: z.string().nonempty(),
					id: z.number().positive(),
				})
			)
			.optional(),
		fileUpload: z.array(z.instanceof(File)),
	})
	.refine((data) => (data.productTypes ? data.productTypes.length > 0 : true), {
		message: 'Select at least one Product Type',
		path: ['productTypes'],
	})
	.refine((data) => (data.fileUpload ? data.fileUpload.length > 0 : true), {
		message: 'File upload cannot be empty.',
		path: ['fileUpload'],
	})
	.and(ADASchema);

type FormSchema = z.infer<typeof formSchema>;

const formDefaultValues: FormSchema = {
	projectName: '',
	turnaroundTime: '',
	designDetails: '',
	projectDescription: '',
	layoutType: '',
	productTypes: [],
	fileUpload: [],
	hasADA: false,
};

export { formDefaultValues, formSchema, type FormSchema };
