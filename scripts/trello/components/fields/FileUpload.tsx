import { Button } from '@/components/ui/button';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormSchema } from '@/trello/helpers/schema';
import { useRef, useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { FormType } from '@/trello/helpers/types';
const getButtonText = (files?: File[]) => {
	if (!files?.length) return 'Upload Files';
	const fileCount = files.length;
	return `Selected ${fileCount} ${fileCount === 1 ? 'file' : 'files'}`;
};

export default function FileUpload({ form }: FormType) {
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

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const fileUpload = useWatch({
		control: form.control,
		name: 'fileUpload',
	});

	return (
		<FormField
			control={form.control}
			name="fileUpload"
			render={({ field: { value, ...field } }) => (
				<FormItem className="relative grid gap-2">
					<FormLabel className="uppercase font-semibold text-base">
						Uploads
					</FormLabel>
					<FormControl>
						<div className="space-y-4">
							<Button
								type="button"
								variant="outline"
								onClick={handleButtonClick}
								className="uploadFiles inline-block bg-button border-0 relative cursor-pointer max-w-52 w-full font-semibold uppercase hover:bg-[#9F9F9F] hover:text-white"
							>
								{getButtonText(fileUpload)}
							</Button>
							<Input
								{...field}
								id="fileUpload"
								value={undefined}
								type="file"
								ref={fileInputRef}
								multiple
								onChange={handleFileChange}
								className="hidden"
							/>
							{fileUpload?.length > 0 && (
								<div className="text-[0.8rem] text-muted-foreground">
									<ul className="space-y-1">
										{fileUpload.map((file, index) => (
											<li key={index}>{file.name}</li>
										))}
									</ul>
								</div>
							)}
							<p className="text-[#868686] text-sm">
								Please upload logos, designs, branding guides, site photos,
								inspiration, and other relevant files to help us understand your
								project. Multiple file uploads are allowed.
							</p>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
