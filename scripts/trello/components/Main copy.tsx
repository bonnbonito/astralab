import ProjectDetails from './ProjectDetails';
import ProjectType from './ProductType';
import ADAWayfinding from './products/ADA/ADAWayfinding';
import { WatchedValues } from '@/trello/helpers/types';

interface MainProps {
	form: any;
	productComponent?: string[]; // Optional array of strings
	productId?: number[]; // Optional array of numbers
	watchedValues: WatchedValues; // Optional array of any type
}

export default function Main({
	form,
	productComponent = [],
	productId = [],
	watchedValues,
}: MainProps) {
	return (
		<>
			<div className="flex-1 w-full">
				<ProjectDetails form={form} />

				<h3 className="text-[30px]">PRODUCT TYPE</h3>
				<ProjectType form={form} />

				{productId.map((id, index) => (
					<div key={id} className="productAccordion mt-6">
						{productComponent[index] === 'ADAWayfinding' && (
							<ADAWayfinding
								form={form}
								product={id}
								watchedValues={watchedValues}
							/>
						)}
					</div>
				))}
			</div>
		</>
	);
}
