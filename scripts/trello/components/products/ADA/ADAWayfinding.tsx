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
import { SkeletonCard } from '@/trello/components/SkeletonCard';
import { ProductTypeDataProps } from '@/trello/helpers/types';
import Signs from './Signs';

interface ADAWayfindingProps {
	form: UseFormReturn<FormSchema>;
	product: number;
}

declare const astralab: Record<string, string>;

export default function ADAWayfinding({ form, product }: ADAWayfindingProps) {
	const [productType, setProductType] = useState<ProductTypeDataProps | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	const numberOfSigns = form.watch('ADA.numberOfSigns');

	const processedProductType = useMemo(() => productType, [productType]);

	const types = processedProductType?.product_types_options?.find(
		(item) => item.name === 'Types'
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
				console.log(data);
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

	useEffect(() => {
		const currentValue = parseInt(numberOfSigns) || 0;
		const formValues = form.getValues('ADA.signs') || [];

		if (formValues.length > currentValue) {
			// Remove excess form values
			const updatedSigns = formValues.slice(0, currentValue);
			form.setValue('ADA.signs', updatedSigns);
		}
	}, [numberOfSigns, form]);

	return (
		<Accordion
			type="single"
			collapsible
			defaultValue={product.toString()}
			className="border border-input border-solid rounded"
		>
			<AccordionItem value={product.toString()}>
				<AccordionTrigger className="uppercase bg-transparent mb-0 text-[26px] font-medium shadow-none hover:no-underline [&>svg]:h-6 [&>svg]:w-6 pl-4">
					{loading
						? 'Loading...'
						: processedProductType?.title?.rendered || 'No Data Available'}
				</AccordionTrigger>
				<AccordionContent>
					{loading ? (
						<SkeletonCard />
					) : (
						<div className="p-4 pt-0">
							{/* Render Number of Signs Input */}
							<NumberSigns form={form} fieldName="ADA.numberOfSigns" />
							{numberOfSigns && (
								<Signs form={form} numberOfSigns={numberOfSigns} />
							)}

							<ProductOptions
								form={form}
								options={types?.options || []}
								formKey="ADA.types"
								optionTitle="Types"
							/>

							<DesignInspiration
								form={form}
								fieldName="ADA[designInspirations]"
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
