import { useWatch } from 'react-hook-form';
import { FormType } from '@/trello/helpers/types';

export default function SidebarMonuments({ form }: FormType) {
	const monumentsAndPylons = useWatch({
		control: form.control,
		name: 'monumentsAndPylons',
	});
	const numberOfSigns = monumentsAndPylons?.numberOfSigns ?? 0;
	return (
		<>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Number of Signs</div>
				<div className="text-xs">{numberOfSigns}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Sign Text & Content
				</div>
				<div className="text-xs">
					{monumentsAndPylons?.textAndContent || ''}
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Sides</div>
				<div className="text-xs">{monumentsAndPylons?.sides || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Dimensions</div>
				<div className="text-xs">{monumentsAndPylons?.dimensions || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Maximum Content Area
				</div>
				<div className="text-xs">
					{monumentsAndPylons?.maxContentArea || ''}
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Minimum Content Area
				</div>
				<div className="text-xs">
					{monumentsAndPylons?.minContentArea || ''}
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Maximum Ground Clearance
				</div>
				<div className="text-xs">
					{monumentsAndPylons?.maxGroundClearance || ''}
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Types</div>
				<div className="text-xs">{monumentsAndPylons?.types}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Illumination</div>
				<div className="text-xs">{monumentsAndPylons?.illumination}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Design Inspiration
				</div>
				<div className="text-xs">
					{monumentsAndPylons?.designInspirations
						?.map((inspiration) => `${inspiration.title}`)
						.join(', ')}
				</div>
			</div>
		</>
	);
}
