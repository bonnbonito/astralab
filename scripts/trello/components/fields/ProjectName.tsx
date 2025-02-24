import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormType } from '@/trello/helpers/types';

export default function ProjectName({ form }: FormType) {
	return (
		<FormField
			control={form.control}
			name="projectName"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="uppercase font-semibold text-base">
						Project Name
					</FormLabel>
					<FormControl>
						<Input placeholder="Enter project name" {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
