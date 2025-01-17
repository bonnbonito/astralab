import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/trello/helpers/schema';
import { COMPONENT_MAP, ComponentType } from '@/trello/helpers/defaults';

interface SidebarDetailsProps {
	title: string;
	form: UseFormReturn<FormSchema>;
	component?: ComponentType;
}

export default function SidebarDetails({
	title,
	form,
	component,
}: SidebarDetailsProps) {
	// Early return if no component is specified
	if (!component) {
		return null;
	}

	const SidebarComponent = COMPONENT_MAP[component].sidebar;

	return (
		<div className="mb-4">
			<h4 className="uppercase font-semibold text-base mb-1">{title}</h4>
			<div className="pl-2">
				<SidebarComponent form={form} />
			</div>
		</div>
	);
}
