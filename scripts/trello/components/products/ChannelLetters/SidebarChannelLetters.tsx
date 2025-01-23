import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn } from 'react-hook-form';

interface SidebarChannelLettersProps {
	form: UseFormReturn<FormSchema>;
}

export default function SidebarChannelLetters({
	form,
}: SidebarChannelLettersProps) {
	const channelLetters = form.watch('channelLetters');
	const numberOfSigns = channelLetters?.numberOfSigns ?? 0;
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
				<div className="text-xs">{channelLetters?.textAndContent || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Font</div>
				<div className="text-xs">{channelLetters?.font || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Vendor</div>
				<div className="text-xs">{channelLetters?.vendor || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Wall Dimension</div>
				<div className="text-xs">{channelLetters?.wallDimension || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Sign Dimension</div>
				<div className="text-xs">{channelLetters?.signDimension || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Material</div>
				<div className="text-xs">{channelLetters?.material || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Trim Cap Color</div>
				<div className="text-xs">{channelLetters?.trimCapColor || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Face Color</div>
				<div className="text-xs">{channelLetters?.faceColor || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Return Color</div>
				<div className="text-xs">{channelLetters?.returnColor || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Return Depth</div>
				<div className="text-xs">{channelLetters?.returnDepth || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Types</div>
				<div className="text-xs">{channelLetters?.types}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Backer</div>
				<div className="text-xs">{channelLetters?.backer}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Mounting</div>
				<div className="text-xs">{channelLetters?.mounting}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Design Inspiration
				</div>
				<div className="text-xs">
					{channelLetters?.designInspirations?.join(', ')}
				</div>
			</div>
		</>
	);
}
