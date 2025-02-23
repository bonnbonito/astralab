import { useState, useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/trello/helpers/schema';
import DesignInspiration from '@/trello/components/DesignInspiration';
import { ProductTypeDataProps } from '@/trello/helpers/types';
import AccordionProductType from '@/trello/components/AccordionProductType';
import Textarea from '@/trello/components/fields/Textarea';

interface CustomJobProps {
	form: UseFormReturn<FormSchema>;
	product: number;
}

declare const astralab: Record<string, string>;

export default function CustomJob({ form, product }: CustomJobProps) {
	const [productType, setProductType] = useState<ProductTypeDataProps | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	const processedProductType = useMemo(() => productType, [productType]);

	useEffect(() => {
		async function fetchProductTypes() {
			try {
				setLoading(true);
				const response = await fetch(`${astralab['product-types']}/${product}`);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data: ProductTypeDataProps = await response.json();
				setProductType(data || null);
			} catch (error) {
				console.error('Error fetching product type:', error);
				setProductType(null);
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
				<div className="my-6">
					<div className="mb-6">
						<Textarea
							form={form}
							name="customJob.description"
							label="Custom Job Description"
							placeholder="Enter your description here"
						/>
					</div>
				</div>

				<DesignInspiration
					form={form}
					fieldName="customJob[designInspirations]"
					options={
						Array.isArray(processedProductType?.design_inspiration)
							? processedProductType.design_inspiration.map((inspiration) => ({
									name: inspiration.title,
									images: Array.isArray(inspiration.images)
										? inspiration.images.map((image) => ({
												url: image.url,
												title: image.title,
										  }))
										: [],
							  }))
							: []
					}
				/>
			</div>
		</AccordionProductType>
	);
}
