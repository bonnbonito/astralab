import { FieldValues } from 'react-hook-form';

export interface WatchedValues {
	projectName: string;
	turnaroundTime: string;
	projectDescription: string;
	layoutType: string;
	fileUpload: File[]; // Must be an array of `File` objects
	productComponent?: string[]; // Optional, array of strings
	productId?: number[]; // Optional, array of numbers
	designDetails?: string; // Optional, string
	productType?: Record<string, { title: string }>;
}

export interface MyFormValues extends FieldValues {
	productType: Record<
		number,
		{
			numberOfSigns: number;
			project?: {
				name: string;
				dimensions: string;
				details: string;
			}[];
			typeSelections?: string[];
		}
	>;
}
