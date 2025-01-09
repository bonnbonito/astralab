import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn } from 'react-hook-form';

interface SidebarDimensionalLettersProps {
	form: UseFormReturn<FormSchema>;
}

export default function SidebarDimensionalLetters({
	form,
}: SidebarDimensionalLettersProps) {
	const dimensionalLetters = form.watch('dimensionalLetters');
	const numberOfSigns = dimensionalLetters?.numberOfSigns ?? 0;
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
					{dimensionalLetters?.textAndContent || ''}
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Font</div>
				<div className="text-xs">{dimensionalLetters?.font || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Vendor</div>
				<div className="text-xs">{dimensionalLetters?.vendor || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Wall Dimension</div>
				<div className="text-xs">{dimensionalLetters?.wallDimension || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Sign Dimension</div>
				<div className="text-xs">{dimensionalLetters?.signDimension || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Sides</div>
				<div className="text-xs">{dimensionalLetters?.sides || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Back Panel</div>
				<div className="text-xs">{dimensionalLetters?.backPanel || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Location</div>
				<div className="text-xs">{dimensionalLetters?.location || ''}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Types</div>
				<div className="text-xs">{dimensionalLetters?.types?.join(', ')}</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">Mounting</div>
				<div className="text-xs">
					{dimensionalLetters?.mounting?.join(', ')}
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mb-1">
				<div className="uppercase font-semibold text-sm">
					Design Inspiration
				</div>
				<div className="text-xs">
					{dimensionalLetters?.designInspirations?.join(', ')}
				</div>
			</div>
		</>
	);
}