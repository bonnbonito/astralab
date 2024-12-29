import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn, FieldValues } from 'react-hook-form';

interface ProjectFormValues extends FieldValues {
	projectName: string;
}

interface ProjectNameProps {
	form: UseFormReturn<ProjectFormValues>;
}

export default function ProjectName({ form }: ProjectNameProps) {
	return (
		<FormField
			control={form.control}
			name="projectName"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="uppercase font-medium">Project Name</FormLabel>
					<FormControl>
						<Input placeholder="Enter project name" {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
