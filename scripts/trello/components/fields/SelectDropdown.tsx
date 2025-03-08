import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn, FieldPath } from 'react-hook-form';

interface SelectDropdownProps {
	form: UseFormReturn<FormSchema>;
	name: FieldPath<FormSchema>;
	options: string[];
	label?: string;
}

export default function SelectDropdown({
	form,
	options,
	name,
	label = 'Select an option',
}: SelectDropdownProps) {
	return (
		<div className="lg:max-w-[221px]">
			<FormField
				control={form.control}
				name={name}
				render={({ field }) => (
					<FormItem>
						<FormLabel className="uppercase font-semibold text-base">
							{label}
						</FormLabel>
						<FormControl>
							<Select onValueChange={field.onChange} value={field.value}>
								<SelectTrigger className="border-solid font-light">
									<SelectValue placeholder="Select an option" />
								</SelectTrigger>
								<SelectContent>
									{options.length > 0 ? (
										options.map((option, index) => (
											<SelectItem key={`${option}-${index}`} value={option}>
												{option}
											</SelectItem>
										))
									) : (
										<p>No options available</p>
									)}
								</SelectContent>
							</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
