import { useState, useEffect } from 'react';
import ProjectName from './fields/ProjectName';
import TurnaroundTime from './fields/TurnaroundTime';
import DesignDetails from './fields/DesignDetails';
import ProjectDescription from './fields/ProjectDescription';
import LayoutType from './fields/LayoutType';
import FileUpload from './fields/FileUpload';

interface ProjectDetailsProps {
	form: any;
}

declare const astralab: any;

export default function ProjectDetails({ form }: ProjectDetailsProps) {
	const [options, setOptions] = useState<any>(null);
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

	const turnaroundTimeOptions = options?.turnaround_time || [];
	const layoutTypeOptions = options?.layout_types || [];
	const designDetailsOptions = options?.design_details || [];

	return (
		<div className="border px-4 py-6 mb-8 rounded">
			<div className="grid md:grid-cols-[45%_1fr_1fr] gap-4 mb-4">
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

			<div className="mb-4">
				<ProjectDescription form={form} />
			</div>

			<div className="mb-4">
				<LayoutType
					form={form}
					layoutTypeOptions={layoutTypeOptions}
					loading={loading}
				/>
			</div>

			<div className="mb-4">
				<FileUpload form={form} />
			</div>
		</div>
	);
}
