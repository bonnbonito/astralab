import { useState, useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import NumberSigns from '@/trello/components/fields/NumberSigns';
import DesignInspiration from '@/trello/components/DesignInspiration';
import { ProductOptions } from '@/trello/components/fields/ProductOptions';
import { ProductProps, ProductTypeDataProps } from '@/trello/helpers/types';
import Signs from './Signs';
import AccordionProductType from '@/trello/components/AccordionProductType';
import { Astralab } from '@/trello/helpers/types';

declare const astralab: Astralab;

export default function ADAWayfinding({ form, product }: ProductProps) {
	const [productType, setProductType] = useState<ProductTypeDataProps | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	const numberOfSigns = useWatch({
		control: form.control,
		name: 'ADA.numberOfSigns',
	});

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
		<AccordionProductType
			product={product}
			loading={loading}
			title={processedProductType?.title?.rendered}
		>
			<div className="p-4 pt-0">
				{/* Render Number of Signs Input */}
				<NumberSigns form={form} fieldName="ADA.numberOfSigns" />
				{numberOfSigns && <Signs form={form} numberOfSigns={numberOfSigns} />}

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
