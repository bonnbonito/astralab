import { useState, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import NumberSigns from '@/trello/components/fields/NumberSigns';
import { FormSchema } from '@/trello/helpers/schema';
import DesignInspiration from '@/trello/components/DesignInspiration';
import { ProductOptions } from '@/trello/components/fields/ProductOptions';
import TextField from '@/trello/components/fields/TextField';
import { ProductTypeDataProps } from '@/trello/helpers/types';
import AccordionProductType from '@/trello/components/AccordionProductType';

interface MonumentsProps {
	form: UseFormReturn<FormSchema>;
	product: number;
}

declare const astralab: Record<string, string>;

export default function MonumentsAndPylons({ form, product }: MonumentsProps) {
	const [productType, setProductType] = useState<ProductTypeDataProps | null>(
		null
	);
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
				const data: ProductTypeDataProps = await response.json();
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
		<AccordionProductType
			product={product}
			loading={loading}
			title={processedProductType?.title?.rendered}
		>
			<div className="p-4 pt-0">
				{/* Render Number of Signs Input */}
				<NumberSigns form={form} fieldName="monumentsAndPylons.numberOfSigns" />

				<div className="my-6">
					<TextField
						form={form}
						name="monumentsAndPylons.textAndContent"
						label="Sign Text & Content"
						placeholder="Text & Content"
					/>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mb-6">
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

				<div className="mb-6">
					<ProductOptions
						form={form}
						options={types?.options || []}
						formKey="monumentsAndPylons.types"
						optionTitle="Types"
					/>
				</div>
				<div className="mb-6">
					<ProductOptions
						form={form}
						options={illuminations?.options || []}
						formKey="monumentsAndPylons.illumination"
						optionTitle="Illumination"
					/>
				</div>

				<DesignInspiration
					form={form}
					fieldName="monumentsAndPylons[designInspirations]"
					options={
						processedProductType?.design_inspiration?.map((inspiration) => ({
							name: inspiration.title,
							images: inspiration.images.map((image) => ({
								url: image.url,
								title: image.title,
							})),
						})) || []
					}
				/>
			</div>
		</AccordionProductType>
	);
}
