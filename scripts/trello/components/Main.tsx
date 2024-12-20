import ProjectDetails from './ProjectDetails';
import ProjectType from './ProductType';
import ADAWayfinding from './products/ADAWayfinding';

interface MainProps {
	form: any;
	productType?: string[];
}

export default function Main({ form, productType }: MainProps) {
	return (
		<>
			<div className="flex-1 w-full">
				<ProjectDetails form={form} />

				<h3>PRODUCT TYPE</h3>
				<ProjectType form={form} />

				{productType?.includes('ADA Wayfinding') && <ADAWayfinding />}
			</div>
		</>
	);
}
