import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn } from 'react-hook-form';

interface ProjectNameProps {
	form: UseFormReturn<FormSchema>;
}

export default function ProjectName({ form }: ProjectNameProps) {
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
