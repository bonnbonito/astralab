import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductTypeProps {
	form: any;
}

export default function ProductType({ form }: ProductTypeProps) {
	const layoutOptions = [
		{
			id: 'ada-wayfinding',
			label: 'ADA Wayfinding',
			imageUrl:
				'http://localhost:8888/wp-content/uploads/2024/12/Lightbox-1-1.png',
		},
		{
			id: 'monuments',
			label: 'Monuments & Pylons',
			imageUrl:
				'http://localhost:8888/wp-content/uploads/2024/12/Lightbox-1-1.png',
		},
		{
			id: 'channel-letters',
			label: 'Channel Letters',
			imageUrl:
				'http://localhost:8888/wp-content/uploads/2024/12/Lightbox-1-1.png',
		},
		{
			id: 'dimensional-letters',
			label: 'Dimensional Letters',
			imageUrl:
				'http://localhost:8888/wp-content/uploads/2024/12/Lightbox-1-1.png',
		},
		{
			id: 'lightbox',
			label: 'Lightbox',
			imageUrl:
				'http://localhost:8888/wp-content/uploads/2024/12/Lightbox-1-1.png',
		},
		{
			id: 'undecided',
			label: 'Undecided',
			imageUrl:
				'http://localhost:8888/wp-content/uploads/2024/12/Lightbox-1-1.png',
		},
	];

	return (
		<>
			<div className="border px-4 py-6 mb-8 rounded">
				<div className="mb-4">
					<FormField
						control={form.control}
						name="productType"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="uppercase font-medium">
									Product Type
								</FormLabel>
								<FormControl>
									<div className="grid grid-cols-3 gap-6">
										{layoutOptions.map((option) => (
											<div key={option.id}>
												<div className="flex items-start justify-between gap-4">
													<Checkbox
														id={option.id}
														checked={field.value?.includes(option.label)}
														onCheckedChange={(checked) => {
															const newValue = checked
																? [...(field.value || []), option.label]
																: field.value.filter(
																		(v: string) => v !== option.label
																  );
															field.onChange(newValue);
														}}
														className="p-0 border-solid bg-transparent"
													/>
													<Label
														htmlFor={option.id}
														className="cursor-pointer uppercase font-medium text-sm"
													>
														{option.label}
													</Label>
												</div>
												<div>
													<Label
														htmlFor={option.id}
														className="cursor-pointer uppercase font-medium text-sm"
													>
														<img
															src={option.imageUrl}
															alt={option.label}
															className="object-cover mt-2 rounded-md w-full"
														/>
													</Label>
												</div>
											</div>
										))}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		</>
	);
}
