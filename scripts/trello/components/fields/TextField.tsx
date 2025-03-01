import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn } from 'react-hook-form';

interface TextFieldProps {
	form: UseFormReturn<FormSchema>;
	name: string;
	label: string;
	placeholder?: string;
	rules?: any;
	customClass?: string;
}

export default function TextField({
	form,
	name,
	label,
	placeholder = '',
	rules,
	customClass,
}: TextFieldProps) {
	return (
		<div className={customClass}>
			<FormField
				control={form.control}
				name={name as keyof FormSchema}
				rules={rules}
				shouldUnregister={true}
				render={({ field }) => (
					<FormItem>
						<FormLabel className="uppercase font-semibold text-base">
							{label}
						</FormLabel>
						<FormControl>
							<Input
								className="form-input"
								placeholder={placeholder}
								{...field}
								value={typeof field.value === 'string' ? field.value : ''}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
