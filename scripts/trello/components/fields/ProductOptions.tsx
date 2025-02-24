import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

interface ProductOptionsProps {
	form: UseFormReturn<FormSchema>;
	options: Array<{
		title: string;
		image: string;
	}>;
	formKey: string;
	optionTitle: string;
}

export const ProductOptions = ({
	form,
	options,
	formKey,
	optionTitle,
}: ProductOptionsProps) => {
	return (
		<FormField
			control={form.control}
			name={formKey as keyof FormSchema}
			render={({ field }) => (
				<FormItem className="mt-4">
					<FormLabel className="uppercase font-semibold text-base mt-4">
						{optionTitle}
					</FormLabel>
					<FormControl>
						<RadioGroup
							onValueChange={field.onChange}
							value={field.value as string}
							className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(195px,1fr))] gap-4"
						>
							{options &&
								options.map(
									(
										option: { title: string; image: string },
										optionIndex: number
									) => {
										const optionKey = `${formKey}-${optionIndex}`;
										return (
											<div key={`radio-${optionKey}`} className="text-center">
												{/* Radio and Label */}
												<div className="flex items-center mb-2">
													<RadioGroupItem
														id={optionKey}
														value={option.title}
														className="p-0 border-solid border-input bg-transparent"
													/>
													<Label
														htmlFor={optionKey}
														className="cursor-pointer ml-2 font-semibold uppercase text-sm text-ellipsis overflow-hidden whitespace-nowrap"
														title={option.title}
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
														title={option.title}
													/>
												</Label>
											</div>
										);
									}
								)}
						</RadioGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
