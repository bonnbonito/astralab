import { useState, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import NumberSigns from '@/trello/components/fields/NumberSigns';
import { FormSchema } from '@/trello/helpers/schema';
import DesignInspiration from '@/trello/components/DesignInspiration';
import { ProductOptions } from '@/trello/components/fields/ProductOptions';
import TextField from '@/trello/components/fields/TextField';
import { ProductTypeDataProps } from '@/trello/helpers/types';
import AccordionProductType from '@/trello/components/AccordionProductType';

interface DimensionalLettersProps {
	form: UseFormReturn<FormSchema>;
	product: number;
}

declare const astralab: Record<string, string>;

export default function DimensionalLetters({
	form,
	product,
}: DimensionalLettersProps) {
	const [productType, setProductType] = useState<ProductTypeDataProps | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	const numberOfSigns = form.watch('dimensionalLetters.numberOfSigns');

	const processedProductType = useMemo(() => productType, [productType]);

	const types = processedProductType?.product_types_options?.find(
		(item) => item.name === 'Types'
	);

	const mounting = processedProductType?.product_types_options?.find(
		(item) => item.name === 'Mounting'
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
				<NumberSigns form={form} fieldName="dimensionalLetters.numberOfSigns" />

				<div className="my-6">
					<div className="grid md:grid-cols-3 gap-6 mb-6">
						<TextField
							form={form}
							name="dimensionalLetters.textAndContent"
							label="Sign Text & Content"
							placeholder="Text and Content"
							customClass="md:col-span-2"
						/>
						<TextField
							form={form}
							name="dimensionalLetters.font"
							label="Font"
							placeholder="select font"
						/>
					</div>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mb-6">
					<TextField
						form={form}
						name="dimensionalLetters.wallDimension"
						label="Wall Dimension (WXH)"
					/>
					<TextField
						form={form}
						name="dimensionalLetters.signDimension"
						label="Sign Dimension (WXH)"
					/>
					<TextField
						form={form}
						name="dimensionalLetters.sides"
						label="Sides"
					/>
					<TextField
						form={form}
						name="dimensionalLetters.backPanel"
						label="Back Panel"
					/>
					<TextField
						form={form}
						name="dimensionalLetters.location"
						label="Location"
					/>
				</div>

				<div className="mb-6">
					<ProductOptions
						form={form}
						options={types?.options || []}
						formKey="dimensionalLetters.types"
						optionTitle="Types"
					/>
				</div>

				<div className="mb-6">
					<ProductOptions
						form={form}
						options={mounting?.options || []}
						formKey="dimensionalLetters.mounting"
						optionTitle="Mounting"
					/>
				</div>

				<DesignInspiration
					form={form}
					fieldName="dimensionalLetters[designInspirations]"
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
