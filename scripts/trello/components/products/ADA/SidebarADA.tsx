import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface SidebarADAProps {
	form: UseFormReturn<FormSchema>;
}

export default function SidebarADA({ form }: SidebarADAProps) {
	const ADA = useWatch({
		control: form.control,
		name: 'ADA',
	});
	const numberOfSigns = ADA?.numberOfSigns ?? 0;
	const signs = ADA?.signs;
	return (
		<>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Number of Signs</div>
				<div className="text-xs">{numberOfSigns}</div>
			</div>
			<div className="pl-4 max-h-[72px] overflow-y-auto">
				{signs?.map((sign, index) => (
					<div key={`adaSign-${index}`}>
						<div className="grid grid-cols-2 gap-4 mb-1">
							<div className="uppercase font-semibold text-sm">
								No.{index + 1} Name
							</div>
							<div className="text-xs">{sign?.name ?? ''}</div>
						</div>
						<div className="grid grid-cols-2 gap-4 mb-1">
							<div className="uppercase font-semibold text-sm">
								No.{index + 1} Width X Height
							</div>
							<div className="text-xs">{sign?.dimension ?? ''}</div>
						</div>
						<div className="grid grid-cols-2 gap-4 mb-3">
							<div className="uppercase font-semibold text-sm">
								No.{index + 1} Detail
							</div>
							<div className="text-xs">{sign.details ?? ''}</div>
						</div>
					</div>
				))}
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Types</div>
				<div className="text-xs">{ADA?.types}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Design Inspiration
				</div>
				<div className="text-xs">
					{ADA?.designInspirations
						?.map((inspiration) => `${inspiration.title}`)
						.join(', ')}
				</div>
			</div>
		</>
	);
}
