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

import { FieldValues, UseFormReturn } from 'react-hook-form';

interface TurnaroundTimeOption {
	name: string;
}

interface MyFormValues extends FieldValues {
	turnaroundTime: string;
}

interface TurnaroundTimeProps {
	form: UseFormReturn<MyFormValues>;
	turnaroundTimeOptions: TurnaroundTimeOption[];
	loading: boolean;
}

export default function TurnaroundTime({
	form,
	turnaroundTimeOptions,
	loading,
}: TurnaroundTimeProps) {
	return (
		<FormField
			control={form.control}
			name="turnaroundTime"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="uppercase font-medium">
						Turnaround Time
					</FormLabel>
					<FormControl>
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger className="border-solid font-light">
								<SelectValue placeholder="Select an option" />
							</SelectTrigger>
							<SelectContent>
								{loading ? (
									<p>Loading options...</p>
								) : turnaroundTimeOptions.length > 0 ? (
									turnaroundTimeOptions.map((option, index) => (
										<SelectItem key={index} value={option.name}>
											{option.name}
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
	);
}
