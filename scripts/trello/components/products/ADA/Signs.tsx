import { FormSchema } from '@/trello/helpers/schema';
import TextField from '@/trello/components/fields/TextField';
import { UseFormReturn } from 'react-hook-form';

interface SignsType {
	form: UseFormReturn<FormSchema>;
	numberOfSigns: string;
}

const Signs = ({ form, numberOfSigns }: SignsType) => {
	return Array.from({ length: Number(numberOfSigns) }, (_, index) => (
		<div key={index} className="mt-4 grid md:grid-cols-3 gap-4">
			<TextField
				form={form}
				name={`ADA.signs.${index}.name`}
				label={`No.${index + 1} Name`}
				placeholder={`Enter project name ${index + 1}`}
			/>
			<TextField
				form={form}
				name={`ADA.signs.${index}.dimension`}
				label={`No. ${index + 1} Width x Height`}
				placeholder={`Enter ${index + 1} dimensions`}
			/>
			<TextField
				form={form}
				name={`ADA.signs.${index}.details`}
				label={`Sign ${index + 1} Details`}
				placeholder={`Enter details for sign ${index + 1}`}
			/>
		</div>
	));
};

export default Signs;
