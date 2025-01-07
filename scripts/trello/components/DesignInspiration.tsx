import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/trello/helpers/schema';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

export default function DesignInspiration({
	form,
	options = [],
	fieldName,
}: {
	form: UseFormReturn<FormSchema>;
	options?: {
		name: string;
		image: string;
		group: string;
	}[];
	fieldName: string;
}) {
	const [tab, selectTab] = useState<string>('Basic');

	const isCurrent = (current: string, state: string): boolean => {
		return current === state;
	};

	function groupExists(groupName: string): boolean {
		return options.some((item) => item.group === groupName);
	}

	return (
		<div className="mt-6">
			<FormField
				control={form.control}
				name={fieldName as keyof FormSchema}
				render={() => (
					<FormItem>
						<FormLabel className="uppercase font-medium text-base">
							Design Inspiration
						</FormLabel>
						<div className="mt-2 flex no-wrap justify-between border-b-[#D2D2D2] border-b uppercase overflow-x-auto">
							{groupExists('Basic') && (
								<div
									className={`px-6 py-2 text-center cursor-pointer border whitespace-nowrap ${
										isCurrent('Basic', tab)
											? 'border-t-[#D2D2D2] border-x-[#D2D2D2]'
											: 'border-transparent border-b-0'
									}`}
									onClick={() => selectTab('Basic')}
								>
									Basic
								</div>
							)}

							{groupExists('Modern') && (
								<div
									className={`px-6 py-2 text-center cursor-pointer border whitespace-nowrap ${
										isCurrent('Modern', tab)
											? 'border-t-[#D2D2D2] border-x-[#D2D2D2]'
											: 'border-transparent border-b-0'
									}`}
									onClick={() => selectTab('Modern')}
								>
									Modern
								</div>
							)}

							{groupExists('Decorative') && (
								<div
									className={`px-6 py-2 text-center cursor-pointer border whitespace-nowrap ${
										isCurrent('Decorative', tab)
											? 'border-t-[#D2D2D2] border-x-[#D2D2D2]'
											: 'border-transparent border-b-0'
									}`}
									onClick={() => selectTab('Decorative')}
								>
									Decorative
								</div>
							)}

							{groupExists('Corporate') && (
								<div
									className={`px-6 py-2 text-center cursor-pointer border whitespace-nowrap ${
										isCurrent('Corporate', tab)
											? 'border-t-[#D2D2D2] border-x-[#D2D2D2]'
											: 'border-transparent border-b-0'
									}`}
									onClick={() => selectTab('Corporate')}
								>
									Corporate
								</div>
							)}

							<div
								className={`px-6 py-2 text-center cursor-pointer border whitespace-nowrap ${
									isCurrent('Classic', tab)
										? 'border-t-[#D2D2D2] border-x-[#D2D2D2]'
										: 'border-transparent border-b-0'
								}`}
								onClick={() => selectTab('Classic')}
							>
								Classic
							</div>
							<div
								className={`px-6 py-2 text-center cursor-pointer border whitespace-nowrap ${
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
							{options.map((option, index) => {
								const designArray: string[] =
									form.getValues(fieldName as any) || [];
								const isChecked = designArray.some(
									(item) => item === option.name
								);

								return (
									<div
										key={`${fieldName}-${index}`}
										className={
											tab === option.group || tab === 'All' ? '' : 'hidden'
										}
									>
										<div
											data-tooltip-id={`${fieldName}-${index}`}
											data-tooltip-content={option.name}
										>
											<Label
												htmlFor={`${fieldName}-${index}`}
												className="cursor-pointer uppercase font-medium text-sm relative"
											>
												<div className="flex items-start justify-between gap-4">
													<Checkbox
														id={`${fieldName}-${index}`}
														checked={isChecked}
														onCheckedChange={(checked: boolean) => {
															let updatedDesigns = [...designArray];

															if (checked) {
																updatedDesigns.push(option.name);
															} else {
																updatedDesigns = updatedDesigns.filter(
																	(item) => item !== option.name
																);
															}
															form.setValue(
																fieldName as keyof FormSchema,
																updatedDesigns as any
															);

															form.trigger(fieldName as keyof FormSchema);
														}}
														className="p-0 border-solid bg-transparent ml-auto absolute top-2 right-2 bg-white rounded-full"
													/>
												</div>
												<img
													src={option.image || 'placeholder-image-url'}
													alt={option.name}
													className="object-cover rounded-md w-full aspect-[4/3]"
												/>
											</Label>
										</div>
										<Tooltip id={`${fieldName}-${index}`} />
									</div>
								);
							})}
						</div>
					</FormItem>
				)}
			/>
		</div>
	);
}
