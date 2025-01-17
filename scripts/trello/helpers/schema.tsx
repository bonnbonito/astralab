import { z } from 'zod';

import { ADASchema } from '@/trello/components/products/ADA/schema';
import { MonumentsAndPylonsSchema } from '@/trello/components/products/MonumentsAndPylons/schema';
import { ChannelLettersSchema } from '@/trello/components/products/ChannelLetters/schema';
import { DimensionalLettersSchema } from '../components/products/DimensionalLetters/schema';
import { LightboxSchema } from '../components/products/Lightbox/schema';

const formSchema = z
	.object({
		projectName: z.string().min(2, {
			message: 'Project Name must contain at least 2 character(s)',
		}),
		turnaroundTime: z
			.string()
			.nonempty({ message: 'Turnaround Time is required.' }),
		designDetails: z.string().nonempty({
			message: 'Design Details is required.',
		}),
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
		fileUpload: z.array(z.instanceof(File)).min(1, {
			message: 'Upload atleast 1 File.',
		}),
	})
	.refine((data) => (data.productTypes ? data.productTypes.length > 0 : true), {
		message: 'Select at least one Product Type',
		path: ['productTypes'],
	})
	.and(ADASchema)
	.and(MonumentsAndPylonsSchema)
	.and(ChannelLettersSchema)
	.and(DimensionalLettersSchema)
	.and(LightboxSchema);

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
	hasMonumentsAndPylons: false,
	hasChannelLetters: false,
	hasDimensionalLetters: false,
	hasLightbox: false,
};

export { formDefaultValues, formSchema, type FormSchema };
