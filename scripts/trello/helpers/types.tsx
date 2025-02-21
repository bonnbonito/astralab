import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './schema';

export interface Astralab {
	ajax_url: string;
	nonce: string;
	'product-types': string;
	options: string;
}

export interface ProductTypeProps {
	form: UseFormReturn<FormSchema>;
}

export interface Options {
	turnaround_time: string[];
	layout_types: string[];
	design_details: { name: string }[];
}

export interface ProductTypeDataProps {
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
		title: string;
		images: {
			url: string;
			title: string;
		}[];
	}[];
}
