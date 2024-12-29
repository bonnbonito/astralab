import SidebarADA from './products/ADA/SidebarADA';

interface SidebarDetailsProps {
	productTypes?: { [key: string]: any }; // Allow flexible types for dynamic keys
	title: string;
	component?: string;
}

export default function SidebarDetails({
	productTypes,
	title,
	component,
}: SidebarDetailsProps) {
	return (
		<div className="mb-4">
			<h4
				className="uppercase font-semibold text-base mb-1"
				dangerouslySetInnerHTML={{ __html: title }}
			/>

			{component === 'ADAWayfinding' && (
				<SidebarADA productTypes={productTypes} />
			)}
		</div>
	);
}
