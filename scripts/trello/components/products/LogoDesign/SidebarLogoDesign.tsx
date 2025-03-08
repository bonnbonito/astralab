import { useWatch } from 'react-hook-form';
import { FormType } from '@/trello/helpers/types';

export default function SidebarLogoDesign({ form }: FormType) {
	const logoDesign = useWatch({
		control: form.control,
		name: 'logoDesign',
	}) as {
		description?: string;
		designInspirations?: { title: string; url: string }[];
	};

	return (
		<>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Description</div>
				<div className="text-xs">{logoDesign?.description || ''}</div>
			</div>
			{logoDesign?.designInspirations && (
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">
						Design Inspiration
					</div>
					<div className="text-xs">
						{logoDesign?.designInspirations
							?.map((inspiration) => `${inspiration.title}`)
							.join(', ')}
					</div>
				</div>
			)}
		</>
	);
}
