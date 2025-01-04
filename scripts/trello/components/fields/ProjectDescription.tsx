import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn } from 'react-hook-form';

interface ProjectDescriptionProps {
	form: UseFormReturn<FormSchema>;
}

export default function ProjectDescription({ form }: ProjectDescriptionProps) {
	return (
		<FormField
			control={form.control}
			name="projectDescription"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="uppercase font-medium">
						Project Description
					</FormLabel>
					<FormControl>
						<Textarea
							className="min-h-48"
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
