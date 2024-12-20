import ProjectDetails from './ProjectDetails';
import ProjectType from './ProductType';

interface MainProps {
	form: any;
}

export default function Main({ form }: MainProps) {
	return (
		<>
			<div className="flex-1 w-full">
				<ProjectDetails form={form} />

				<h3>PRODUCT TYPE</h3>
				<ProjectType form={form} />
			</div>
		</>
	);
}
