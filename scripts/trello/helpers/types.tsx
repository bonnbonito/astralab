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
