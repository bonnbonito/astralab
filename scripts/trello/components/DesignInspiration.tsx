import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/trello/helpers/schema';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

interface ImageData {
	title: string;
	url: string;
}

interface OptionType {
	name: string;
	images: ImageData[];
}

export default function DesignInspiration({
	form,
	options = [],
	fieldName,
}: {
	form: UseFormReturn<FormSchema>;
	options?: OptionType[];
	fieldName: string;
}) {
	const [tab, selectTab] = useState<string>(options[0]?.name || '');

	const isCurrent = (current: string, state: string): boolean => {
		return current === state;
	};

	console.log(options);

	return (
		<div className="mt-6">
			<FormField
				control={form.control}
				name={fieldName as keyof FormSchema}
				render={() => (
					<FormItem>
						<FormLabel className="uppercase font-semibold text-base">
							Design Inspiration
						</FormLabel>
						<div className="mt-2 flex no-wrap justify-between border-b-[#D2D2D2] border-b uppercase overflow-x-auto">
							{options.map((option, index) => (
								<div
									key={`${fieldName}-tab-${index}`}
									className={`px-6 py-2 text-center cursor-pointer border whitespace-nowrap font-semibold ${
										isCurrent(option.name, tab)
											? 'border-t-[#D2D2D2] border-x-[#D2D2D2]'
											: 'border-transparent border-b-0'
									}`}
									onClick={() => selectTab(option.name)}
								>
									{option.name}
								</div>
							))}
							<div
								className={`px-6 py-2 text-center cursor-pointer border whitespace-nowrap font-semibold ${
									isCurrent('All', tab)
										? 'border-t-[#D2D2D2] border-x-[#D2D2D2]'
										: 'border-transparent border-b-0'
								}`}
								onClick={() => selectTab('All')}
							>
								All
							</div>
						</div>
						<div className="mt-4 grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(195px,1fr))] gap-4">
							{options.map((option, optionIndex) => {
								return option.images.map((image, imageIndex) => {
									const designArray: string[] =
										form.getValues(fieldName as any) || [];
									const isChecked = designArray.includes(image.title);

									return (
										<div
											key={`${fieldName}-${optionIndex}-${imageIndex}`}
											className={
												tab === option.name || tab === 'All' ? '' : 'hidden'
											}
										>
											<div
												data-tooltip-id={`${fieldName}-${optionIndex}-${imageIndex}`}
												data-tooltip-content={image.title}
											>
												<Label
													htmlFor={`${fieldName}-${optionIndex}-${imageIndex}`}
													className="cursor-pointer uppercase font-medium text-sm relative"
												>
													<div className="flex items-start justify-between gap-4">
														<Checkbox
															id={`${fieldName}-${optionIndex}-${imageIndex}`}
															checked={isChecked}
															onCheckedChange={(checked: boolean) => {
																let updatedDesigns = [...designArray];

																if (checked) {
																	updatedDesigns.push(image.title);
																} else {
																	updatedDesigns = updatedDesigns.filter(
																		(item) => item !== image.title
																	);
																}
																form.setValue(
																	fieldName as keyof FormSchema,
																	updatedDesigns as any
																);

																form.trigger(fieldName as keyof FormSchema);
															}}
															className="p-0 border-input border-solid bg-transparent ml-auto absolute top-2 right-2 bg-white rounded-full"
														/>
													</div>
													<img
														src={image.url}
														alt={image.title}
														className="object-cover rounded-md w-full aspect-[4/3]"
													/>
												</Label>
											</div>
											<Tooltip
												id={`${fieldName}-${optionIndex}-${imageIndex}`}
											/>
										</div>
									);
								});
							})}
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
