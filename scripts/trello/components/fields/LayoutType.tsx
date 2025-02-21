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
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/trello/helpers/schema';
import LayoutImage from './LayoutImage';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface LayoutOption {
	title: string;
	image: { url: string };
	content?: string;
}

interface LayoutTypeProps {
	form: UseFormReturn<FormSchema>;
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
					<FormLabel className="font-semibold text-base">
						<p className="mb-0 uppercase">Layout Type</p>
						<span className="text-xs font-light ">
							more details on layout type. <a href="#">CLICK HERE</a>
						</span>
					</FormLabel>
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
										<Tooltip>
											<TooltipTrigger asChild>
												<div>
													<div className="flex items-center gap-2 mb-1">
														<RadioGroupItem
															className="p-0 bg-transparent border-input border-solid"
															value={option.title}
															id={`layout-${index}`}
														/>
														<Label
															htmlFor={`layout-${index}`}
															className="cursor-pointer"
														>
															<span className="text-sm font-semibold">
																{option.title}
															</span>
														</Label>
													</div>
													<LayoutImage
														image={option.image.url}
														title={option.title}
													/>
												</div>
											</TooltipTrigger>
											{option.content && (
												<TooltipContent>
													<div
														className="text-base max-w-[300px] p-4 *:text-white"
														dangerouslySetInnerHTML={{
															__html: option.content,
														}}
													></div>
												</TooltipContent>
											)}
										</Tooltip>
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
