import { Button } from '@/components/ui/button';
import SidebarDetails from './SidebarDetails';
import { UseFormReturn } from 'react-hook-form';

import { FormSchema } from '@/trello/helpers/schema';

interface SidebarProps {
	form: UseFormReturn<FormSchema>;
}

export default function Sidebar({ form }: SidebarProps) {
	const watchedValues = form.watch();
	const productTypes = watchedValues.productTypes || {};
	const hasProductTypes = Object.keys(productTypes).length > 0;

	let submitLabel = 'Place Order';
	if (form.formState.isSubmitting) {
		submitLabel = 'Please wait...';
	}

	if (form.formState.isSubmitSuccessful) {
		submitLabel = 'Order Placed';
	}

	return (
		<div className="md:max-w-[310px] w-full ">
			<div className="px-4 py-6 border border-input flex-1 rounded sticky top-12 max-h-[80vh] overflow-y-auto">
				<h5 className="uppercase font-semibold text-lg">Project Summary</h5>

				{/* General Project Details */}
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

				{/* File Uploads */}
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Uploads</div>
					<div className="text-xs">
						{watchedValues.fileUpload &&
							watchedValues.fileUpload?.length > 0 && (
								<ul>
									{watchedValues.fileUpload?.map((file, index) => (
										<li key={index}>{file.name}</li>
									))}
								</ul>
							)}
					</div>
				</div>

				{/* Product Types */}
				{hasProductTypes && (
					<div className="mt-4">
						<h5 className="uppercase font-semibold text-lg">Product Types</h5>

						{Object.entries(productTypes).map(([id, productObject], index) => {
							if (
								typeof productObject === 'object' &&
								productObject !== null &&
								'title' in productObject &&
								'component' in productObject
							) {
								return (
									<SidebarDetails
										title={
											typeof productObject.title === 'string'
												? productObject.title
												: 'Untitled Product'
										}
										key={id}
										form={form}
										component={
											typeof productObject.component === 'string'
												? productObject.component
												: ''
										}
									/>
								);
							}

							// Log and skip invalid entries
							console.error(
								`Invalid productObject for ID ${id}:`,
								productObject
							);
							return null;
						})}
					</div>
				)}

				{/* Submit Button */}
				<Button
					type="submit"
					className="w-full uppercase font-semibold"
					disabled={form.formState.isSubmitting}
				>
					{submitLabel}
				</Button>
			</div>
		</div>
	);
}
