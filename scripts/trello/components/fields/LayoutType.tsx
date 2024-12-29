import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn, FieldValues } from 'react-hook-form';

interface LayoutOption {
	title: string;
	id: string;
	image: { url: string };
}

interface MyFormValues extends FieldValues {
	layoutType: string;
}

interface LayoutTypeProps {
	form: UseFormReturn<MyFormValues>;
	loading: boolean;
	layoutTypeOptions: LayoutOption[];
}

export default function LayoutType({
	form,
	loading,
	layoutTypeOptions,
}: LayoutTypeProps) {
	return (
		<FormField
			control={form.control}
			name="layoutType"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="uppercase font-medium">Layout Type</FormLabel>
					<FormControl>
						<RadioGroup
							value={field.value}
							onValueChange={(value) => field.onChange(value)}
							className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4"
						>
							{loading ? (
								Array.from({ length: 4 }).map((_, index) => (
									<div
										key={index}
										className="flex flex-col space-y-3 h-[167px]"
									>
										<Skeleton className="h-[125px] w-full rounded-xl" />
										<div className="space-y-2">
											<Skeleton className="h-4 w-full" />
										</div>
									</div>
								))
							) : layoutTypeOptions.length > 0 ? (
								layoutTypeOptions.map((option, index) => (
									<div key={index}>
										<div className="flex items-center gap-2 mb-1">
											<RadioGroupItem
												className="p-0 bg-transparent border-solid"
												value={option.title}
												id={`layout-${index}`}
											/>
											<Label
												htmlFor={`layout-${index}`}
												className="cursor-pointer"
											>
												<span className="text-sm font-medium">
													{option.title}
												</span>
											</Label>
										</div>
										<Label
											htmlFor={`layout-${index}`}
											className="cursor-pointer"
										>
											<img
												src={option.image.url}
												alt={option.title}
												className="object-cover mb-2 w-full"
											/>
										</Label>
									</div>
								))
							) : (
								<p>No options available</p>
							)}
						</RadioGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
