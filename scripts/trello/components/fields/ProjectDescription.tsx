import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FormType } from '@/trello/helpers/types';

export default function ProjectDescription({ form }: FormType) {
	return (
		<FormField
			control={form.control}
			name="projectDescription"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="uppercase font-semibold text-base">
						Project Description
					</FormLabel>
					<FormControl>
						<Textarea
							className="min-h-48 focus:ring-1 focus:ring-ring focus:border-none"
							onChange={field.onChange}
							value={field.value}
							placeholder="Describe your project"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
