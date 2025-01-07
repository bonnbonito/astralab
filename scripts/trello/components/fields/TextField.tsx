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
}

export default function TextField({
	form,
	name,
	label,
	placeholder = '',
	rules,
}: TextFieldProps) {
	return (
		<FormField
			control={form.control}
			name={name as keyof FormSchema}
			rules={rules}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="uppercase font-medium text-base">
						{label}
					</FormLabel>
					<FormControl>
						<Input
							placeholder={placeholder}
							{...field}
							value={typeof field.value === 'string' ? field.value : ''} // Validate value type
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}