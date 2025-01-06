import { useState, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import NumberSigns from '@/trello/components/products/ADA/NumberSigns';
import TextField from '@/trello/components/fields/TextField';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { FormSchema } from '@/trello/helpers/schema';
import DesignInspiration from '../../DesignInspiration';

interface ProductTypeData {
	title?: {
		rendered: string;
	};
	component_field?: string;
	id?: number;
	product_types_options?: {
		title: string;
		image: string;
	}[];
	design_inspiration?: {
		name: string;
		image: string;
		group: string;
	}[];
}

interface ADAWayfindingProps {
	form: UseFormReturn<FormSchema>;
	product: number;
}

declare const astralab: Record<string, string>;

export default function ADAWayfinding({ form, product }: ADAWayfindingProps) {
	const [productType, setProductType] = useState<ProductTypeData | null>(null);
	const [loading, setLoading] = useState(true);

	const numberOfSigns = form.watch('ADA.numberOfSigns');

	const processedProductType = useMemo(() => productType, [productType]);

	useEffect(() => {
		async function fetchProductTypes() {
			try {
				setLoading(true);
				const response = await fetch(`${astralab['product-types']}/${product}`);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data: ProductTypeData = await response.json();
				setProductType(data || null); // Ensure null fallback if data is invalid
			} catch (error) {
				console.error('Error fetching product type:', error);
				setProductType(null); // Set null if fetching fails
			} finally {
				setLoading(false);
			}
		}
		fetchProductTypes();
	}, [product]);

	return (
		<Accordion
			type="single"
			collapsible
			defaultValue={product.toString()}
			className="border border-solid rounded"
		>
			<AccordionItem value={product.toString()}>
				<AccordionTrigger className="bg-transparent mb-0 text-[26px] font-medium shadow-none hover:no-underline [&>svg]:h-6 [&>svg]:w-6 pl-4">
					{loading
						? 'Loading...'
						: processedProductType?.title?.rendered || 'No Data Available'}
				</AccordionTrigger>
				<AccordionContent>
					{loading ? (
						<span>Loading...</span>
					) : (
						<div className="p-4 pt-0">
							{/* Render Number of Signs Input */}
							<NumberSigns form={form} />
							{numberOfSigns &&
								Array.from({ length: Number(numberOfSigns) }, (_, index) => (
									<div key={index} className="mt-4 grid md:grid-cols-3 gap-4">
										<TextField
											form={form}
											name={`ADA.signs.${index}.name`}
											label={`No.${index + 1} Name`}
											placeholder={`Enter project name ${index + 1}`}
										/>
										<TextField
											form={form}
											name={`ADA.signs.${index}.dimension`}
											label={`No. ${index + 1} Width x Height`}
											placeholder={`Enter ${index + 1} dimensions`}
										/>
										<TextField
											form={form}
											name={`ADA.signs.${index}.details`}
											label={`Sign ${index + 1} Details`}
											placeholder={`Enter details for sign ${index + 1}`}
										/>
									</div>
								))}

							<FormField
								control={form.control}
								name="ADA.types"
								render={() => (
									<FormItem className="mt-4">
										<FormLabel className="uppercase font-medium text-base mt-4">
											Types
										</FormLabel>
										<FormControl>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
												{processedProductType?.product_types_options?.map(
													(option, optionIndex) => {
														const optionKey = `option-${optionIndex}`;
														const currentSelections =
															(form.getValues(`ADA.types`) as string[]) || [];
														const isChecked = currentSelections?.includes(
															option.title
														);

														return (
															<div
																key={`checkbox-${optionKey}`}
																className="text-center"
															>
																{/* Checkbox and Label */}
																<div className="flex items-center mb-2">
																	<Checkbox
																		id={optionKey}
																		checked={isChecked}
																		onCheckedChange={(checked) => {
																			let updatedSelections: string[] =
																				currentSelections || [];
																			if (checked) {
																				updatedSelections = [
																					...updatedSelections,
																					option.title,
																				];
																			} else {
																				updatedSelections =
																					updatedSelections.filter(
																						(item) => item !== option.title
																					);
																			}
																			form.setValue(
																				`ADA.types`,
																				updatedSelections
																			);
																			form.trigger('ADA.types');
																		}}
																		className="p-0 border-solid bg-transparent"
																	/>
																	<Label
																		htmlFor={optionKey}
																		className="cursor-pointer ml-2 font-medium uppercase"
																	>
																		{option.title}
																	</Label>
																</div>
																{/* Image */}
																<Label
																	htmlFor={optionKey}
																	className="cursor-pointer"
																>
																	<img
																		src={option.image}
																		alt={option.title}
																		className="w-full h-auto rounded"
																	/>
																</Label>
															</div>
														);
													}
												)}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DesignInspiration
								form={form}
								fieldName="ADA[designInspirations]"
								options={
									processedProductType?.design_inspiration?.map(
										(inspiration) => ({
											name: inspiration.name,
											image: inspiration.image,
											group: inspiration.group,
										})
									) || []
								}
							/>
						</div>
					)}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
