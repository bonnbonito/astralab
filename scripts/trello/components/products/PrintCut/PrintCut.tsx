import { useState, useEffect, useMemo } from 'react';
import DesignInspiration from '@/trello/components/DesignInspiration';
import { ProductProps, ProductTypeDataProps } from '@/trello/helpers/types';
import AccordionProductType from '@/trello/components/AccordionProductType';
import Textarea from '@/trello/components/fields/Textarea';
import { Astralab } from '@/trello/helpers/types';
import SelectDropdown from '../../fields/SelectDropdown';

declare const astralab: Astralab;

export default function PrintCut({ form, product }: ProductProps) {
	const [productType, setProductType] = useState<ProductTypeDataProps | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	const processedProductType = useMemo(() => productType, [productType]);

	const typeOptions = [
		'Banners',
		'Digital Print',
		'Cut Vinyl',
		'Print & Cut',
		'Yard Signs',
	];

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
				<SelectDropdown
					form={form}
					name="printCut.type"
					label="Type"
					options={typeOptions}
				/>

				<div className="my-6">
					<div className="mb-6">
						<Textarea
							form={form}
							name="printCut.description"
							label="Description"
							placeholder="Enter your description here"
						/>
					</div>
				</div>

				<DesignInspiration
					form={form}
					fieldName="printCut[designInspirations]"
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
