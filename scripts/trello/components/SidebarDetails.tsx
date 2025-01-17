import { memo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/trello/helpers/schema';
import { COMPONENT_MAP, ComponentType } from '@/trello/helpers/defaults';

interface SidebarDetailsProps {
	title: string;
	form: UseFormReturn<FormSchema>;
	component?: ComponentType;
}

const SidebarDetails = memo(
	({ title, form, component }: SidebarDetailsProps) => {
		if (!component) {
			return null;
		}

		const SidebarComponent = COMPONENT_MAP[component].sidebar;

		return (
			<div className="mb-4">
				<h4
					className="uppercase font-semibold text-base mb-1"
					dangerouslySetInnerHTML={{ __html: title }}
				/>
				<div className="pl-2">
					<SidebarComponent form={form} />
				</div>
			</div>
		);
	}
);

SidebarDetails.displayName = 'SidebarDetails';

export default SidebarDetails;
