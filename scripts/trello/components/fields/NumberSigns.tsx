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
import { UseFormReturn } from 'react-hook-form';

interface NumberSignsProps {
	form: UseFormReturn<FormSchema>;
	name: string;
	number?: number; // Maximum number of signs (default: 30)
}

export default function NumberSigns({
	form,
	name,
	number = 30,
}: NumberSignsProps) {
	console.log(name);
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<div>
					<FormLabel className="uppercase font-medium text-base">
						Number of Signs
					</FormLabel>

					<div className="grid grid-cols-3 gap-4 items-center mt-1">
						<FormItem>
							<FormControl>
								<Select
									onValueChange={(value) => {
										field.onChange(value);
										console.log('Selected value:', value);
										console.log(field);
									}}
									value={
										typeof field.value === 'number'
											? field.value.toString()
											: typeof field.value === 'string'
											? field.value
											: ''
									}
								>
									<SelectTrigger className="border-solid font-light">
										<SelectValue placeholder="Select an option" />
									</SelectTrigger>
									<SelectContent>
										{Array.from({ length: number }, (_, i) => i + 1).map(
											(num) => (
												<SelectItem key={num} value={num.toString()}>
													{num}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
						<div className="col-span-2">
							<p>
								Size Template - Download the template to upload multiple orders
							</p>
						</div>
					</div>
				</div>
			)}
		/>
	);
}
