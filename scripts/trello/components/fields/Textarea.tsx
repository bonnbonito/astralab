import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea as TextareaUI } from '@/components/ui/textarea';
import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn } from 'react-hook-form';

interface TextareaProps {
	form: UseFormReturn<FormSchema>;
	name: string;
	label: string;
	placeholder?: string;
	rules?: any;
	customClass?: string;
}

export default function Textarea({
	form,
	name,
	label,
	placeholder = '',
	rules,
	customClass,
}: TextareaProps) {
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
							<TextareaUI
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
