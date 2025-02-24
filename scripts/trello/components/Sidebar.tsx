import { Button } from '@/components/ui/button';
import SidebarDetails from './SidebarDetails';
import { useWatch } from 'react-hook-form';
import { ComponentType } from '@/trello/helpers/defaults';
import { decodeHTMLEntities } from '@/lib/utils';
import { FormType } from '@/trello/helpers/types';

export default function Sidebar({ form }: FormType) {
	const turnaroundTime = useWatch({
		control: form.control,
		name: 'turnaroundTime',
	});

	const designDetails = useWatch({
		control: form.control,
		name: 'designDetails',
	});

	const projectDescription = useWatch({
		control: form.control,
		name: 'projectDescription',
	});

	const layoutType = useWatch({
		control: form.control,
		name: 'layoutType',
	});

	const productTypes = useWatch({
		control: form.control,
		name: 'productTypes',
	});

	const hasProductTypes = productTypes
		? Object.keys(productTypes).length > 0
		: false;

	const fileUpload = useWatch({
		control: form.control,
		name: 'fileUpload',
	});

	const bulkOrderFile = useWatch({
		control: form.control,
		name: 'bulkOrderFile',
	});

	const projectNameVal = useWatch({
		control: form.control,
		name: 'projectName',
	});

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
					<div className="text-xs">{projectNameVal}</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Turnaround Time</div>
					<div className="text-xs">{turnaroundTime}</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Design Details</div>
					<div className="text-xs">{designDetails}</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">
						Project Description
					</div>
					<div className="text-xs">{projectDescription}</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Layout Type</div>
					<div className="text-xs">{layoutType}</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Uploads</div>
					<div className="text-xs">
						{fileUpload && fileUpload?.length > 0 && (
							<ul>
								{fileUpload?.map((file, index) => (
									<li key={index}>{file.name}</li>
								))}
							</ul>
						)}
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-1">
					<div className="uppercase font-semibold text-sm">Bulk Order</div>
					<div className="text-xs">
						{bulkOrderFile && (
							<span className="truncate block">{bulkOrderFile.name}</span>
						)}
					</div>
				</div>

				{/* Product Types */}
				{hasProductTypes && (
					<div className="mt-4">
						<h5 className="uppercase font-semibold text-lg">Product Types</h5>

						{productTypes &&
							Object.entries(productTypes).map(([id, productObject], index) => {
								if (
									typeof productObject === 'object' &&
									productObject !== null &&
									'title' in productObject &&
									'component' in productObject
								) {
									const component = productObject.component as ComponentType;

									return (
										<SidebarDetails
											title={
												typeof productObject.title === 'string'
													? decodeHTMLEntities(productObject.title)
													: 'Untitled Product'
											}
											key={id}
											form={form}
											component={component}
										/>
									);
								}

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
