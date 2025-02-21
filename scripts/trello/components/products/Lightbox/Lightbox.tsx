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
import TextField from '@/trello/components/fields/TextField';
import { SkeletonCard } from '@/trello/components/SkeletonCard';
import { ProductTypeDataProps } from '@/trello/helpers/types';

interface LightboxProps {
	form: UseFormReturn<FormSchema>;
	product: number;
}

declare const astralab: Record<string, string>;

export default function Lightbox({ form, product }: LightboxProps) {
	const [productType, setProductType] = useState<ProductTypeDataProps | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	const numberOfSigns = form.watch('lightbox.numberOfSigns');

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
		<Accordion
			type="single"
			collapsible
			defaultValue={product.toString()}
			className="border border-input border-solid rounded"
		>
			<AccordionItem value={product.toString()}>
				<AccordionTrigger className="uppercase bg-transparent mb-0 text-[26px] font-medium shadow-none hover:no-underline [&>svg]:h-6 [&>svg]:w-6 pl-4">
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
						<SkeletonCard />
					) : (
						<div className="p-4 pt-0">
							{/* Render Number of Signs Input */}
							<NumberSigns form={form} fieldName="lightbox.numberOfSigns" />

							<div className="my-6">
								<div className="grid md:grid-cols-3 gap-6 mb-6">
									<TextField
										form={form}
										name="lightbox.textAndContent"
										label="Sign Text & Content"
										placeholder="Text & Content"
										customClass="md:col-span-2"
									/>
									<TextField
										form={form}
										name="lightbox.font"
										label="Font"
										placeholder="select font"
									/>
								</div>
							</div>

							<div className="grid md:grid-cols-3 gap-6 mb-6">
								<TextField
									form={form}
									name="lightbox.wallDimension"
									label="Wall Dimension (WXH)"
								/>
								<TextField
									form={form}
									name="lightbox.signDimension"
									label="Sign Dimension (WXH)"
								/>
								<TextField form={form} name="lightbox.depth" label="Depth" />
								<TextField form={form} name="lightbox.sides" label="Sides" />
								<TextField form={form} name="lightbox.color" label="Color" />
								<TextField
									form={form}
									name="lightbox.retainers"
									label="Retainers"
								/>
							</div>

							<div className="mb-6">
								<ProductOptions
									form={form}
									options={types?.options || []}
									formKey="lightbox.types"
									optionTitle="Types"
								/>
							</div>

							<div className="mb-6">
								<ProductOptions
									form={form}
									options={mounting?.options || []}
									formKey="lightbox.mounting"
									optionTitle="Mounting"
								/>
							</div>

							<DesignInspiration
								form={form}
								fieldName="lightbox[designInspirations]"
								options={
									processedProductType?.design_inspiration?.map(
										(inspiration) => ({
											name: inspiration.title,
											images: inspiration.images.map((image) => ({
												url: image.url,
												title: image.title,
											})),
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
