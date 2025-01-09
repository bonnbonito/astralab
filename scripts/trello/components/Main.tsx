import ProjectDetails from './ProjectDetails';
import ProjectType from './ProductType';
import ADAWayfinding from './products/ADA/ADAWayfinding';
import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn } from 'react-hook-form';
import Loading from './Loading';
import MonumentsAndPylons from './products/MonumentsAndPylons/MonumentsAndPylons';
import ChannelLetters from './products/ChannelLetters/ChannelLetters';
import DimensionalLetters from './products/DimensionalLetters/DimensionalLetters';
import Lightbox from './products/Lightbox/Lightbox';

export interface MainProps {
	form: UseFormReturn<FormSchema>;
}

export default function Main({ form }: MainProps) {
	const productTypes = form.watch('productTypes');
	return (
		<div className="flex-1 w-full relative">
			<ProjectDetails form={form} />

			<h3 className="text-[30px]">PRODUCT TYPE</h3>
			<ProjectType form={form} />

			{productTypes?.map((productType, index) => (
				<div key={productType.id} className="productAccordion mt-6">
					{productType.component === 'ADAWayfinding' && (
						<>
							<ADAWayfinding form={form} product={productType.id} />
						</>
					)}
					{productType.component === 'MonumentsAndPylons' && (
						<>
							<MonumentsAndPylons form={form} product={productType.id} />
						</>
					)}
					{productType.component === 'ChannelLetters' && (
						<>
							<ChannelLetters form={form} product={productType.id} />
						</>
					)}
					{productType.component === 'DimensionalLetters' && (
						<>
							<DimensionalLetters form={form} product={productType.id} />
						</>
					)}

					{productType.component === 'Lightbox' && (
						<>
							<Lightbox form={form} product={productType.id} />
						</>
					)}
				</div>
			))}

			{form.formState.isSubmitting && <Loading />}
		</div>
	);
}
