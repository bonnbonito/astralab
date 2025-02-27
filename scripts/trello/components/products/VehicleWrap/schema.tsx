import { z } from 'zod';

export const VehicleWrapSchema = z.discriminatedUnion('hasVehicleWrap', [
	z.object({
		hasVehicleWrap: z.literal(true),
		vehicleWrap: z.object({
			description: z.string().nonempty({
				message: 'Description is required.',
			}),
			coverage: z.string().nonempty({
				message: 'Coverage is required.',
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
	z.object({ hasVehicleWrap: z.literal(false) }),
]);
