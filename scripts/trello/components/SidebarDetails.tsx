import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/trello/helpers/schema';
import SidebarADA from './products/ADA/SidebarADA';

interface SidebarDetailsProps {
	title: string;
	form: UseFormReturn<FormSchema>;
	component?: string;
}

export default function SidebarDetails({
	title,
	form,
	component,
}: SidebarDetailsProps) {
	return (
		<div className="mb-4">
			<h4
				className="uppercase font-semibold text-base mb-1"
				dangerouslySetInnerHTML={{ __html: title }}
			/>

			{component === 'ADAWayfinding' && <SidebarADA form={form} />}
		</div>
	);
}
