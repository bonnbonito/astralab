import SidebarADA from './products/ADA/SidebarADA';

interface SidebarDetailsProps {
	title: string;
	component?: string;
}

export default function SidebarDetails({
	title,
	component,
}: SidebarDetailsProps) {
	return (
		<div className="mb-4">
			<h4
				className="uppercase font-semibold text-base mb-1"
				dangerouslySetInnerHTML={{ __html: title }}
			/>

			{component === 'ADAWayfinding' && <SidebarADA />}
		</div>
	);
}
