import { z } from 'zod';

import { ADASchema } from '@/trello/components/products/ADA/schema';
import { MonumentsAndPylonsSchema } from '@/trello/components/products/MonumentsAndPylons/schema';
import { ChannelLettersSchema } from '@/trello/components/products/ChannelLetters/schema';
import { DimensionalLettersSchema } from '../components/products/DimensionalLetters/schema';
import { LightboxSchema } from '../components/products/Lightbox/schema';
import { CustomJobSchema } from '../components/products/CustomJob/schema';
import { VehicleWrapSchema } from '../components/products/VehicleWrap/schema';
import { WallVinylSchema } from '../components/products/WallVinyl/schema';
import { PrintCutSchema } from '../components/products/PrintCut/schema';
import { LogoDesignSchema } from '../components/products/LogoDesign/schema';

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
		bulkOrderFile: z.instanceof(File).optional(),
	})
	.refine((data) => (data.productTypes ? data.productTypes.length > 0 : true), {
		message: 'Select at least one Product Type',
		path: ['productTypes'],
	})
	.and(ADASchema)
	.and(MonumentsAndPylonsSchema)
	.and(ChannelLettersSchema)
	.and(DimensionalLettersSchema)
	.and(LightboxSchema)
	.and(CustomJobSchema)
	.and(VehicleWrapSchema)
	.and(WallVinylSchema)
	.and(PrintCutSchema)
	.and(LogoDesignSchema);

type FormSchema = z.infer<typeof formSchema>;

const formDefaultValues: FormSchema = {
	projectName: '',
	turnaroundTime: '',
	designDetails: '',
	projectDescription: '',
	layoutType: '',
	productTypes: [],
	fileUpload: [],
	bulkOrderFile: undefined,
	hasADA: false,
	hasMonumentsAndPylons: false,
	hasChannelLetters: false,
	hasDimensionalLetters: false,
	hasLightbox: false,
	hasCustomJob: false,
	hasVehicleWrap: false,
	hasWallVinyl: false,
	hasPrintCut: false,
	hasLogoDesign: false,
};

export { formDefaultValues, formSchema, type FormSchema };
