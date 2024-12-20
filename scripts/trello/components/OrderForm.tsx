'use client';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Form } from '@/components/ui/form';

import Sidebar from './Sidebar';
import Main from './Main';

const formSchema = z
	.object({
		projectName: z.string().min(2, {
			message: 'Project Name must be at least 2 characters.',
		}),
		turnaroundTime: z.string().optional(),
		designDetails: z.string().optional(),
		projectDescription: z.string().nonempty({
			message: 'Project Description is required.',
		}),
		layoutType: z.string().nonempty({ message: 'Layout Type is required.' }),
		productType: z.array(z.string()),
		fileUpload: z.array(z.instanceof(File)).nonempty({
			message: 'Files are required.',
		}),
	})
	.superRefine((data, ctx) => {
		if (
			data.turnaroundTime === 'option3' &&
			(!data.designDetails || data.designDetails.length === 0)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['designDetails'],
				message:
					'Design Details are required when Turn Around Time is option3.',
			});
		}
	});

export default function OrderForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			projectName: '',
			turnaroundTime: '',
			designDetails: '',
			projectDescription: '',
			layoutType: '',
			productType: [],
			fileUpload: [], // Initialize as an empty array
		},
	});

	const watchedValues = form.watch();

	const [layoutType, productType] = useWatch({
		control: form.control,
		name: ['layoutType', 'productType'], // Watching multiple fields
	});

	// Automatically remove productType values if layoutType is "option2"
	useEffect(() => {
		if (layoutType === 'Layout 2') {
			form.setValue('productType', []);
		}
	}, [layoutType, form]);

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values, 'Tewr');
	}

	return (
		<Form {...form}>
			<h3>PROJECT DETAILS</h3>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-9">
				<Main form={form} />

				<Sidebar watchedValues={watchedValues} />
			</form>
		</Form>
	);
}
