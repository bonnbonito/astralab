import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/trello/helpers/schema';
import SidebarADA from './products/ADA/SidebarADA';
import SidebarMonuments from './products/MonumentsAndPylons/SidebarMonuments';
import SidebarChannelLetters from './products/ChannelLetters/SidebarChannelLetters';
import SidebarDimensionalLetters from './products/DimensionalLetters/SidebarDimensionalLetters';
import SidebarLightbox from './products/Lightbox/SidebarLightbox';

interface SidebarDetailsProps {
	title: string;
	form: UseFormReturn<FormSchema>;
	component?: string;
}

export default function SidebarDetails({
	title,
	form,
	component,
}: SidebarDetailsProps) {
	return (
		<div className="mb-4">
			<h4
				className="uppercase font-semibold text-base mb-1"
				dangerouslySetInnerHTML={{ __html: title }}
			/>
			<div className="pl-2">
				{component === 'ADAWayfinding' && <SidebarADA form={form} />}
				{component === 'MonumentsAndPylons' && <SidebarMonuments form={form} />}
				{component === 'ChannelLetters' && (
					<SidebarChannelLetters form={form} />
				)}
				{component === 'DimensionalLetters' && (
					<SidebarDimensionalLetters form={form} />
				)}
				{component === 'Lightbox' && <SidebarLightbox form={form} />}
			</div>
		</div>
	);
}
