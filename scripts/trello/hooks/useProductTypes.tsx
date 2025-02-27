import { useState, useEffect } from 'react';
import { COMPONENT_MAP } from '@/trello/helpers/defaults';
import { Astralab } from '@/trello/helpers/types';

declare const astralab: Astralab;

export type ProductType = {
	id: number;
	title: { rendered: string };
	featured_media_url: string;
	acf: { component: keyof typeof COMPONENT_MAP };
};

interface UseProductTypesReturn {
	productTypes: ProductType[];
	loading: boolean;
}

export function useProductTypes(): UseProductTypesReturn {
	const [productTypes, setProductTypes] = useState<ProductType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchProductTypes() {
			try {
				const response = await fetch(astralab['product-types']);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data = await response.json();
				data.sort((a: ProductType, b: ProductType) => a.id - b.id);
				console.log(data);
				//make data with slug "custom-job" at the bottom
				const customJob = data.find(
					(item: ProductType) => item.acf.component === 'CustomJob'
				);
				if (customJob) {
					data.splice(data.indexOf(customJob), 1);
					data.push(customJob);
				}
				setProductTypes(data);
			} catch (error) {
				console.error('Error fetching product types:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchProductTypes();
	}, []);

	return { productTypes, loading };
}
