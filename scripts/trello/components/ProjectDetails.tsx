import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ProjectDetailsProps {
	form: any;
}

const layoutOptions = [
	{
		id: 'layout1',
		label: 'Layout 1',
		imageUrl:
			'http://localhost:8888/wp-content/uploads/2024/12/Lightbox-1-1.png',
	},
	{
		id: 'layout2',
		label: 'Layout 2',
		imageUrl:
			'http://localhost:8888/wp-content/uploads/2024/12/Lightbox-1-1.png',
	},
	{
		id: 'layout3',
		label: 'Layout 3',
		imageUrl:
			'http://localhost:8888/wp-content/uploads/2024/12/Lightbox-1-1.png',
	},
	{
		id: 'layout4',
		label: 'Layout 4',
		imageUrl:
			'http://localhost:8888/wp-content/uploads/2024/12/Lightbox-1-1.png',
	},
];

export default function ProjectDetails({ form }: ProjectDetailsProps) {
	return (
		<div className="border px-4 py-6 mb-8 rounded">
			<div className="grid grid-cols-[45%_1fr_1fr] gap-4 mb-4">
				<FormField
					control={form.control}
					name="projectName"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="uppercase font-medium">
								Project Name
							</FormLabel>
							<FormControl>
								<Input placeholder="Enter project name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="turnaroundTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="uppercase font-medium">
								Turnaround Time
							</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className="border-solid font-light">
										<SelectValue placeholder="Select an option" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="option1">Option 1</SelectItem>
										<SelectItem value="option2">Option 2</SelectItem>
										<SelectItem value="option3">Option 3</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="designDetails"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="uppercase font-medium">
								Design Details
							</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className="border-solid font-light">
										<SelectValue placeholder="Select an option" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Option 1">Option 1</SelectItem>
										<SelectItem value="Option 2">Option 2</SelectItem>
										<SelectItem value="Option 3">Option 3</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="mb-4">
				<FormField
					control={form.control}
					name="projectDescription"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="uppercase font-medium">
								Project Description
							</FormLabel>
							<FormControl>
								<Textarea
									className="min-h-48"
									onChange={field.onChange}
									value={field.value}
									placeholder="Describe your project"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="mb-4">
				<FormField
					control={form.control}
					name="layoutType"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="uppercase font-medium">
								Layout Type
							</FormLabel>
							<FormControl>
								<RadioGroup
									value={field.value}
									onValueChange={(value) => field.onChange(value)}
									className={`grid grid-cols-4 gap-4`}
								>
									{layoutOptions.map((option) => (
										<div key={option.id}>
											<div className="flex items-center gap-2 mb-1">
												<RadioGroupItem
													className="p-0 bg-transparent border-solid"
													value={option.label}
													id={option.id}
												/>
												<Label htmlFor={option.id} className="cursor-pointer">
													<span className="text-sm font-medium">
														{option.label}
													</span>
												</Label>
											</div>
											<Label htmlFor={option.id} className="cursor-pointer">
												<img
													src={option.imageUrl}
													alt={option.label}
													className="object-cover mb-2"
												/>
											</Label>
										</div>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="mb-4">
				<FormField
					control={form.control}
					name="fileUpload"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="uppercase font-medium">
								File Upload
							</FormLabel>
							<FormControl>
								<Input
									type="file"
									multiple // Enable multiple file selection
									onChange={(e) => {
										if (e.target.files) {
											// Convert FileList to an array and pass it to the form
											field.onChange(Array.from(e.target.files));
										}
									}}
									className="inline-block"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
