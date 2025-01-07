import { Button } from '@/components/ui/button';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormSchema } from '@/trello/helpers/schema';
import { useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function FileUpload({
	form,
}: {
	form: UseFormReturn<FormSchema>;
}) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Handle form reset in useEffect to properly manage side effects
	useEffect(() => {
		if (form.formState.isSubmitted && fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, [form.formState.isSubmitted]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files?.length) {
			form.setValue('fileUpload', Array.from(files), {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	};

	const fileUpload = form.watch('fileUpload');

	return (
		<FormField
			control={form.control}
			name="fileUpload"
			render={({ field: { value, ...field } }) => (
				<FormItem className="relative">
					<FormLabel className="uppercase font-medium">File Upload</FormLabel>
					<FormControl>
						<Input
							{...field}
							id="fileUpload"
							value={undefined}
							type="file"
							ref={fileInputRef}
							multiple
							onChange={handleFileChange}
							className="inline-block bg-button border-0 !leading-[30px] relative cursor-pointer"
						/>
					</FormControl>
					<div className="text-[0.8rem] text-muted-foreground">
						<ul>
							{fileUpload?.map((file, index) => (
								<li key={index}>{file.name}</li>
							))}
						</ul>
					</div>
				</FormItem>
			)}
		/>
	);
}
