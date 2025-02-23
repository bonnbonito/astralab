import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface SidebarCustomJobProps {
	form: UseFormReturn<FormSchema>;
}

export default function SidebarCustomJob({ form }: SidebarCustomJobProps) {
	const customJob = useWatch({
		control: form.control,
		name: 'customJob',
	}) as {
		description?: string;
		designInspirations?: { title: string; url: string }[];
	};

	return (
		<>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Sign Text & Content
				</div>
				<div className="text-xs">{customJob?.description || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Design Inspiration
				</div>
				<div className="text-xs">
					{customJob?.designInspirations
						?.map((inspiration) => `${inspiration.title}`)
						.join(', ')}
				</div>
			</div>
		</>
	);
}
