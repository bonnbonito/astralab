import { Button } from '@/components/ui/button';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRef, useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { FormType } from '@/trello/helpers/types';
import { X } from 'lucide-react';

const getButtonText = (files?: File[]) => {
	if (!files?.length)
		return (
			<span className="text-[#d2d2d2] text-xl font-semibold">
				Drag & Drop Files Here
			</span>
		);
	const fileCount = files.length;
	return `Selected ${fileCount} ${fileCount === 1 ? 'file' : 'files'}`;
};

export default function FileUpload({ form }: FormType) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	// Handle form reset in useEffect to properly manage side effects
	useEffect(() => {
		if (form.formState.isSubmitted && fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, [form.formState.isSubmitted]);

	const handleFileChange = (files: FileList | File[]) => {
		const fileArray = Array.from(files);
		if (fileArray.length) {
			form.setValue('fileUpload', fileArray, {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	};

	const handleRemoveFile = (indexToRemove: number) => {
		const currentFiles = form.getValues('fileUpload') || [];
		const updatedFiles = currentFiles.filter(
			(_, index) => index !== indexToRemove
		);
		form.setValue('fileUpload', updatedFiles, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		handleFileChange(files);
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
						<div className="relative">
							<div
								className={`space-y-4 py-10 px-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer flex items-center justify-center hover:bg-primary/5 ${
									isDragging
										? 'border-primary bg-primary/5'
										: 'border-muted-foreground/25'
								}`}
								onDragEnter={handleDragEnter}
								onDragLeave={handleDragLeave}
								onDragOver={handleDragOver}
								onDrop={handleDrop}
								onClick={handleButtonClick}
							>
								<div className="m-0 text-primary text-center font-medium">
									{isDragging ? 'Drop files here' : getButtonText(fileUpload)}
								</div>
								<Input
									{...field}
									id="fileUpload"
									value={undefined}
									type="file"
									ref={fileInputRef}
									multiple
									onChange={(e) =>
										e.target.files && handleFileChange(e.target.files)
									}
									className="hidden"
								/>
							</div>
							<p className="text-[#868686] text-sm pt-2">
								Please upload logos, designs, branding guides, site photos,
								inspiration, and other relevant files to help us understand your
								project.
							</p>

							{fileUpload?.length > 0 && (
								<div className="text-muted-foreground">
									<ul className="space-y-1">
										{fileUpload.map((file, index) => (
											<li key={index} className="flex items-center gap-4">
												<span className="truncate max-w-[80%]">
													{file.name}
												</span>
												<span
													onClick={() => handleRemoveFile(index)}
													className="p-1 cursor-pointer text-red-600"
													aria-label={`Remove ${file.name}`}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
														fill="currentColor"
														className="size-5"
													>
														<path
															fillRule="evenodd"
															d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
															clipRule="evenodd"
														/>
													</svg>
												</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
