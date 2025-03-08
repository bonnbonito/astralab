import { useWatch } from 'react-hook-form';
import { FormType } from '@/trello/helpers/types';

export default function SidebarChannelLetters({ form }: FormType) {
	const channelLetters = useWatch({
		control: form.control,
		name: 'channelLetters',
	});
	const numberOfSigns = channelLetters?.numberOfSigns ?? 0;
	return (
		<>
			<div className="grid grid-cols-2 gap-4 mb-1 items-center">
				<div className="uppercase font-semibold text-sm">Number of Signs</div>
				<div className="text-xs">{numberOfSigns}</div>
			</div>

			{channelLetters?.textAndContent && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">
						Sign Text & Content
					</div>
					<div className="text-xs">{channelLetters.textAndContent}</div>
				</div>
			)}
			{channelLetters?.font && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Font</div>
					<div className="text-xs">{channelLetters.font}</div>
				</div>
			)}
			{channelLetters?.wallDimension && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Wall Dimension</div>
					<div className="text-xs">{channelLetters.wallDimension}</div>
				</div>
			)}
			{channelLetters?.signDimension && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Sign Dimension</div>
					<div className="text-xs">{channelLetters.signDimension}</div>
				</div>
			)}
			{channelLetters?.material && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Material</div>
					<div className="text-xs">{channelLetters.material}</div>
				</div>
			)}
			{channelLetters?.trimCapColor && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Trim Cap Color</div>
					<div className="text-xs">{channelLetters.trimCapColor}</div>
				</div>
			)}
			{channelLetters?.faceColor && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Face Color</div>
					<div className="text-xs">{channelLetters.faceColor}</div>
				</div>
			)}
			{channelLetters?.returnColor && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Return Color</div>
					<div className="text-xs">{channelLetters.returnColor}</div>
				</div>
			)}
			{channelLetters?.returnDepth && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Return Depth</div>
					<div className="text-xs">{channelLetters.returnDepth}</div>
				</div>
			)}
			{channelLetters?.types && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Types</div>
					<div className="text-xs">{channelLetters.types}</div>
				</div>
			)}
			{channelLetters?.backer && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Backer</div>
					<div className="text-xs">{channelLetters.backer}</div>
				</div>
			)}
			{channelLetters?.mounting && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">Mounting</div>
					<div className="text-xs">{channelLetters.mounting}</div>
				</div>
			)}
			{channelLetters?.designInspirations && (
				<div className="grid grid-cols-2 gap-4 mb-1 items-center">
					<div className="uppercase font-semibold text-sm">
						Design Inspiration
					</div>
					<div className="text-xs">
						{channelLetters.designInspirations
							?.map((inspiration) => inspiration.title)
							.join(', ')}
					</div>
				</div>
			)}
		</>
	);
}
