import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn } from 'react-hook-form';

interface SidebarLightboxProps {
	form: UseFormReturn<FormSchema>;
}

export default function SidebarLightbox({ form }: SidebarLightboxProps) {
	const lightbox = form.watch('lightbox');
	const numberOfSigns = lightbox?.numberOfSigns ?? 0;
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
				<div className="text-xs">{lightbox?.textAndContent || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Font</div>
				<div className="text-xs">{lightbox?.font || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Wall Dimension</div>
				<div className="text-xs">{lightbox?.wallDimension || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Sign Dimension</div>
				<div className="text-xs">{lightbox?.signDimension || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Depth</div>
				<div className="text-xs">{lightbox?.depth || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Sides</div>
				<div className="text-xs">{lightbox?.sides || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Color</div>
				<div className="text-xs">{lightbox?.color || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Retainers</div>
				<div className="text-xs">{lightbox?.retainers || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Types</div>
				<div className="text-xs">{lightbox?.types}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Mounting</div>
				<div className="text-xs">{lightbox?.mounting}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Design Inspiration
				</div>
				<div className="text-xs">
					{lightbox?.designInspirations?.join(', ')}
				</div>
			</div>
		</>
	);
}
