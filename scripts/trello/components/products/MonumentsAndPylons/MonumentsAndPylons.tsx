import { useState, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import NumberSigns from '@/trello/components/fields/NumberSigns';

import { FormSchema } from '@/trello/helpers/schema';
import DesignInspiration from '@/trello/components/DesignInspiration';
import { ProductOptions } from '@/trello/components/fields/ProductOptions';
import TextField from '../../fields/TextField';

interface MonumentsProductTypeData {
	title?: {
		rendered: string;
	};
	component_field?: string;
	id?: number;
	product_types_options: {
		name: string;
		options: {
			title: string;
			image: string;
		}[];
	}[];
	design_inspiration?: {
		name: string;
		image: string;
		group: string;
	}[];
}

interface MonumentsProps {
	form: UseFormReturn<FormSchema>;
	product: number;
}

declare const astralab: Record<string, string>;

export default function MonumentsAndPylons({ form, product }: MonumentsProps) {
	const [productType, setProductType] =
		useState<MonumentsProductTypeData | null>(null);
	const [loading, setLoading] = useState(true);

	const numberOfSigns = form.watch('monumentsAndPylons.numberOfSigns');

	const processedProductType = useMemo(() => productType, [productType]);

	const types = processedProductType?.product_types_options?.find(
		(item) => item.name === 'Types'
	);

	const illuminations = processedProductType?.product_types_options?.find(
		(item) => item.name === 'Illumination'
	);

	useEffect(() => {
		async function fetchProductTypes() {
			try {
				setLoading(true);
				const response = await fetch(`${astralab['product-types']}/${product}`);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data: MonumentsProductTypeData = await response.json();
				setProductType(data || null); // Ensure null fallback if data is invalid
				console.log(data);
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
					{loading ? (
						'Loading...'
					) : (
						<div
							dangerouslySetInnerHTML={{
								__html:
									processedProductType?.title?.rendered || 'No Data Available',
							}}
						/>
					)}
				</AccordionTrigger>
				<AccordionContent>
					{loading ? (
						<span>Loading...</span>
					) : (
						<div className="p-4 pt-0">
							{/* Render Number of Signs Input */}
							<NumberSigns
								form={form}
								fieldName="monumentsAndPylons.numberOfSigns"
							/>

							<div className="my-4">
								<TextField
									form={form}
									name="monumentsAndPylons.textAndContent"
									label="Sign Text & Content"
									placeholder="specific vendor for fabrication"
								/>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								<TextField
									form={form}
									name="monumentsAndPylons.vendor"
									label="Vendor"
									placeholder="specific vendor for fabrication"
								/>
								<TextField
									form={form}
									name="monumentsAndPylons.sides"
									label="Sides"
								/>
								<TextField
									form={form}
									name="monumentsAndPylons.dimensions"
									label="Dimensions"
								/>
								<TextField
									form={form}
									name="monumentsAndPylons.maxContentArea"
									label="Maximum Content Area"
								/>
								<TextField
									form={form}
									name="monumentsAndPylons.minContentArea"
									label="Minimun Content Area"
								/>
								<TextField
									form={form}
									name="monumentsAndPylons.maxGroundClearance"
									label="Maximum Ground Clearance"
								/>
							</div>

							<ProductOptions
								form={form}
								options={types?.options || []}
								formKey="monumentsAndPylons.types"
								optionTitle="Types"
							/>

							<ProductOptions
								form={form}
								options={illuminations?.options || []}
								formKey="monumentsAndPylons.illumination"
								optionTitle="Illumination"
							/>

							<DesignInspiration
								form={form}
								fieldName="monumentsAndPylons[designInspirations]"
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
