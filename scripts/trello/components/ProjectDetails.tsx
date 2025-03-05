import { useState, useEffect } from 'react';
import ProjectName from './fields/ProjectName';
import TurnaroundTime from './fields/TurnaroundTime';
import DesignDetails from './fields/DesignDetails';
import ProjectDescription from './fields/ProjectDescription';
import LayoutType from './fields/LayoutType';
import FileUpload from './fields/FileUpload';
import BulkOrders from './fields/BulkOrders';
import { Astralab, Options, FormType } from '../helpers/types';

declare const astralab: Astralab;

const defaultOptions: Options = {
	turnaround_time: [],
	layout_types: [],
	design_details: [],
};

export default function ProjectDetails({ form }: FormType) {
	const [options, setOptions] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchOptions() {
			try {
				const response = await fetch(astralab.options);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
				setOptions(data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching options:', error);
				setLoading(false);
			}
		}

		fetchOptions();
	}, []);

	// Use defaultOptions as the fallback
	const typedOptions: Options = options ? (options as Options) : defaultOptions;

	const turnaroundTimeOptions = (typedOptions.turnaround_time || []).map(
		(item) => {
			if (typeof item === 'string') {
				return { name: item };
			}
			return item;
		}
	) as { name: string }[];

	const layoutTypeOptions = (typedOptions.layout_types || []).map((item) => {
		if (typeof item === 'string') {
			return { title: item, image: { url: '' } };
		}
		return item;
	}) as { title: string; image: { url: string } }[];
	const designDetailsOptions = typedOptions?.design_details || [];

	return (
		<div className="border border-input px-4 py-6 mb-8 rounded">
			<div className="grid grid-cols-1 lg:grid-cols-[45%_1fr_1fr] gap-4 mb-6">
				<ProjectName form={form} />

				<TurnaroundTime
					form={form}
					turnaroundTimeOptions={turnaroundTimeOptions}
					loading={loading}
				/>

				<DesignDetails
					form={form}
					designDetailsOptions={designDetailsOptions}
					loading={loading}
				/>
			</div>

			<div className="mb-6">
				<ProjectDescription form={form} />
				<p className="text-muted-foreground text-sm pt-2">
					Describe the signage details. Share a Google Drive/Dropbox link here
					if you have multiple files for reference or design guides.
				</p>
			</div>

			<div className="mb-6">
				<LayoutType
					form={form}
					layoutTypeOptions={layoutTypeOptions}
					loading={loading}
				/>
			</div>

			<div className="mb-6 relative">
				<FileUpload form={form} />
				<BulkOrders form={form} />
			</div>
		</div>
	);
}
