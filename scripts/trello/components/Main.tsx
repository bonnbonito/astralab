import ProjectDetails from './ProjectDetails';
import ProjectType from './ProductType';
import ADAWayfinding from './products/ADA/ADAWayfinding';
import { FormSchema } from '../helpers/schema';
import { UseFormReturn } from 'react-hook-form';

export interface MainProps {
	form: UseFormReturn<FormSchema>;
}

export default function Main({ form }: MainProps) {
	return (
		<div className="flex-1 w-full">
			<ProjectDetails form={form} />

			<h3 className="text-[30px]">PRODUCT TYPE</h3>
			<ProjectType form={form} />
		</div>
	);
}
