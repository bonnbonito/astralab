import { Checkbox } from '@/components/ui/checkbox';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn } from 'react-hook-form';

export const ProductOptions = ({
	form,
	options,
	formKey,
	optionTitle,
}: {
	form: UseFormReturn<FormSchema>;
	options: Array<{
		title: string;
		image: string;
	}>;
	formKey: string;
	optionTitle: string;
}) => {
	return (
		<FormField
			control={form.control}
			name={formKey as keyof FormSchema}
			render={() => (
				<FormItem className="mt-4">
					<FormLabel className="uppercase font-medium text-base mt-4">
						{optionTitle}
					</FormLabel>
					<FormControl>
						<div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(195px,1fr))] gap-4">
							{options &&
								options.map(
									(
										option: { title: string; image: string },
										optionIndex: number
									) => {
										const optionKey = `${formKey}-${optionIndex}`;
										const currentSelections = (form.getValues(
											formKey as keyof FormSchema
										) || []) as unknown as string[];
										const isChecked = currentSelections.includes(option.title);

										return (
											<div
												key={`checkbox-${optionKey}`}
												className="text-center"
											>
												{/* Checkbox and Label */}
												<div className="flex items-center mb-2">
													<Checkbox
														id={optionKey}
														checked={isChecked}
														onCheckedChange={(checked) => {
															let updatedSelections: string[] =
																currentSelections || [];
															if (checked) {
																updatedSelections = [
																	...updatedSelections,
																	option.title,
																];
															} else {
																updatedSelections = updatedSelections.filter(
																	(item) => item !== option.title
																);
															}
															form.setValue(
																formKey as keyof FormSchema,
																updatedSelections as unknown as FormSchema[keyof FormSchema]
															);
															form.trigger(formKey as keyof FormSchema);
														}}
														className="p-0 border-solid bg-transparent"
													/>
													<Label
														htmlFor={optionKey}
														className="cursor-pointer ml-2 font-medium uppercase"
													>
														{option.title}
													</Label>
												</div>
												{/* Image */}
												<Label htmlFor={optionKey} className="cursor-pointer">
													<img
														src={option.image}
														alt={option.title}
														className="w-full aspect-[4/3] rounded"
													/>
												</Label>
											</div>
										);
									}
								)}
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
