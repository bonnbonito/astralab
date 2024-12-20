import { Button } from '@/components/ui/button';

interface SidebarProps {
	watchedValues: {
		layoutType?: string;
		projectName: string;
		turnaroundTime?: string;
		designDetails?: string;
		projectDescription?: string;
		fileUpload?: File[];
		productType?: string[];
	};
}

export default function Sidebar({ watchedValues }: SidebarProps) {
	return (
		<div className="max-w-[310px] w-full  ">
			<div className="px-4 py-6 border flex-1 rounded sticky top-12">
				<h5 className="uppercase font-semibold text-lg">Project Summary</h5>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Project Name</div>
					<div className="text-xs">{watchedValues.projectName}</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Turnaround Time</div>
					<div className="text-xs">{watchedValues.turnaroundTime}</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Design Details</div>
					<div className="text-xs">{watchedValues.designDetails}</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">
						Project Description
					</div>
					<div className="text-xs">{watchedValues.projectDescription}</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Layout Type</div>
					<div className="text-xs">{watchedValues.layoutType}</div>
				</div>

				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Uploads</div>
					<div className="text-xs">
						{watchedValues.fileUpload &&
							watchedValues.fileUpload.length > 0 && (
								<ul>
									{watchedValues.fileUpload.map((file, index) => (
										<li key={index}>{file.name}</li>
									))}
								</ul>
							)}
					</div>
				</div>

				{watchedValues.productType && watchedValues.productType.length > 0 && (
					<div className="mt-4">
						<h5 className="uppercase font-semibold text-lg">Product Types</h5>

						{Array.isArray(watchedValues.productType) &&
							watchedValues.productType.includes('ADA Wayfinding') && (
								<h4 className="uppercase font-semibold text-base">
									ADA Wayfinding
								</h4>
							)}

						{Array.isArray(watchedValues.productType) &&
							watchedValues.productType.includes('Monuments & Pylons') && (
								<h4 className="uppercase font-semibold text-base">
									Monuments & Pylons
								</h4>
							)}

						{Array.isArray(watchedValues.productType) &&
							watchedValues.productType.includes('Channel Letters') && (
								<h4 className="uppercase font-semibold text-base">
									Channel Letters
								</h4>
							)}

						{Array.isArray(watchedValues.productType) &&
							watchedValues.productType.includes('Dimensional Letters') && (
								<h4 className="uppercase font-semibold text-base">
									Dimensional Letters
								</h4>
							)}

						{Array.isArray(watchedValues.productType) &&
							watchedValues.productType.includes('Lightbox') && (
								<h4 className="uppercase font-semibold text-base">Lightbox</h4>
							)}

						{Array.isArray(watchedValues.productType) &&
							watchedValues.productType.includes('Undecided') && (
								<h4 className="uppercase font-semibold text-base">Undecided</h4>
							)}
					</div>
				)}

				<Button type="submit" className="w-full uppercase font-semibold">
					Place Order
				</Button>
			</div>
		</div>
	);
}
