import { Button } from '@/components/ui/button';
import {
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { FormType } from '@/trello/helpers/types';

const bulkFile =
	'http://astralab.ca/wp-content/uploads/2025/03/Astra-Lab_-Sign-Template.xlsx';

export default function BulkOrders({ form }: FormType) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const bulkOrderFile = useWatch({
		control: form.control,
		name: 'bulkOrderFile',
	});

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
					className="bulkOrderButton"
					onClick={() => window.open(bulkFile, '_blank')}
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
										className="uploadFiles truncate"
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
