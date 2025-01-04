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

interface FileUploadProps {
	form: UseFormReturn<FormSchema>;
}

export default function FileUpload({ form }: FileUploadProps) {
	return (
		<FormField
			control={form.control}
			name="fileUpload"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="uppercase font-medium">File Upload</FormLabel>
					<FormControl>
						<Input
							type="file"
							multiple
							onChange={(e) => {
								if (e.target.files) {
									field.onChange(Array.from(e.target.files));
								}
							}}
							className="inline-block"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
