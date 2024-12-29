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

interface DesignDetailsOption {
	name: string;
}

interface MyFormValues extends FieldValues {
	designDetailsOptions: string;
}

interface DesignDetailsProps {
	form: UseFormReturn<MyFormValues>;
	designDetailsOptions: DesignDetailsOption[];
	loading: boolean;
}

export default function DesignDetails({
	form,
	designDetailsOptions,
	loading,
}: DesignDetailsProps) {
	return (
		<FormField
			control={form.control}
			name="designDetails"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="uppercase font-medium">
						Design Details
					</FormLabel>
					<FormControl>
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger className="border-solid font-light">
								<SelectValue placeholder="Select an option" />
							</SelectTrigger>
							<SelectContent>
								{loading ? (
									<p>Loading options...</p>
								) : designDetailsOptions.length > 0 ? (
									designDetailsOptions.map(
										(option: { name: string }, index: number) => (
											<SelectItem key={index} value={option.name}>
												{option.name}
											</SelectItem>
										)
									)
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
