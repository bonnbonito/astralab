import { useWatch } from 'react-hook-form';
import { FormType } from '@/trello/helpers/types';

export default function SidebarVehicleWrap({ form }: FormType) {
	const vehicleWrap = useWatch({
		control: form.control,
		name: 'vehicleWrap',
	});
	return (
		<>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Description</div>
				<div className="text-xs">{vehicleWrap?.description || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Coverage</div>
				<div className="text-xs">{vehicleWrap?.coverage || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Design Inspirations
				</div>
				<div className="text-xs">
					{vehicleWrap?.designInspirations
						?.map((inspiration) => `${inspiration.title}`)
						.join(', ')}
				</div>
			</div>
		</>
	);
}
