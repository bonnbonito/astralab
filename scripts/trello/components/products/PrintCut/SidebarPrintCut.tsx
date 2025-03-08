import { useWatch } from 'react-hook-form';
import { FormType } from '@/trello/helpers/types';

export default function SidebarPrintCut({ form }: FormType) {
	const printCut = useWatch({
		control: form.control,
		name: 'printCut',
	});
	return (
		<>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Description</div>
				<div className="text-xs">{printCut?.description || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Type</div>
				<div className="text-xs">{printCut?.type || ''}</div>
			</div>
			{printCut?.designInspirations && (
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">
						Design Inspirations
					</div>
					<div className="text-xs">
						{printCut?.designInspirations
							?.map((inspiration) => `${inspiration.title}`)
							.join(', ')}
					</div>
				</div>
			)}
		</>
	);
}
