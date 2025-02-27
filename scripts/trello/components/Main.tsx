import ProjectDetails from './ProjectDetails';
import ProjectType from './ProductType';
import ADAWayfinding from './products/ADA/ADAWayfinding';
import { useWatch } from 'react-hook-form';
import Loading from './Loading';
import MonumentsAndPylons from './products/MonumentsAndPylons/MonumentsAndPylons';
import ChannelLetters from './products/ChannelLetters/ChannelLetters';
import DimensionalLetters from './products/DimensionalLetters/DimensionalLetters';
import Lightbox from './products/Lightbox/Lightbox';
import CustomJob from './products/CustomJob/CustomJob';
import { FormType } from '@/trello/helpers/types';
import VehicleWrap from './products/VehicleWrap/VehicleWrap';
export default function Main({ form }: FormType) {
	const productTypes = useWatch({
		control: form.control,
		name: 'productTypes',
	});
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

					{productType.component === 'CustomJob' && (
						<>
							<CustomJob form={form} product={productType.id} />
						</>
					)}

					{productType.component === 'VehicleWrap' && (
						<>
							<VehicleWrap form={form} product={productType.id} />
						</>
					)}
				</div>
			))}

			{form.formState.isSubmitting && <Loading />}
		</div>
	);
}
