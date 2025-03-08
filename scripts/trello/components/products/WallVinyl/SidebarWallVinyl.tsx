import { useWatch } from 'react-hook-form';
import { FormType } from '@/trello/helpers/types';

export default function SidebarWallVinyl({ form }: FormType) {
	const wallVinyl = useWatch({
		control: form.control,
		name: 'wallVinyl',
	});
	return (
		<>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Description</div>
				<div className="text-xs">{wallVinyl?.description || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Type</div>
				<div className="text-xs">{wallVinyl?.type || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Design Inspirations
				</div>
				<div className="text-xs">
					{wallVinyl?.designInspirations
						?.map((inspiration) => `${inspiration.title}`)
						.join(', ')}
				</div>
			</div>
		</>
	);
}
