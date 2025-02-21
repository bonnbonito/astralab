import { Button } from '@/components/ui/button';
import {
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormSchema } from '@/trello/helpers/schema';
import { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function BulkOrders({
	form,
}: {
	form: UseFormReturn<FormSchema>;
}) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const bulkOrderFile = form.watch('bulkOrderFile');

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files?.length) {
			form.setValue('bulkOrderFile', files[0], {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const getButtonText = () => {
		return bulkOrderFile ? bulkOrderFile.name : 'Upload Sheet';
	};

	return (
		<div className="mt-8">
			<h3 className="uppercase font-semibold text-base mb-2">BULK ORDERS</h3>
			<div className="flex items-center gap-3">
				<Button
					type="button"
					variant="outline"
					className="bg-[#9F9F9F] text-white hover:bg-[#8a8a8a] uppercase font-semibold max-w-52 w-full"
				>
					Download Sheet
				</Button>
				<span className="text-sm text-muted-foreground">then</span>
				<FormField
					control={form.control}
					name="bulkOrderFile"
					render={({ field: { value, ...field } }) => (
						<FormItem className="flex-1">
							<FormControl>
								<div>
									<Button
										type="button"
										variant="outline"
										onClick={handleUploadClick}
										className="inline-block bg-button border-0 relative cursor-pointer max-w-52 w-full font-semibold uppercase hover:bg-[#9F9F9F] hover:text-white truncate"
									>
										{getButtonText()}
									</Button>
									<Input
										{...field}
										type="file"
										ref={fileInputRef}
										onChange={handleFileChange}
										className="hidden"
										accept=".xlsx,.xls,.csv"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<p className="text-[#868686] text-sm mt-2">
				For bulk orders, please download the sheet, fill it out, and upload the
				sheet for processing.
			</p>
		</div>
	);
}
