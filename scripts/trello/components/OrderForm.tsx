'use client';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Form } from '@/components/ui/form';

import Sidebar from './Sidebar';
import Main from './Main';

import { projectDetailsSchema } from '../helpers/schema';

import { exampleRefine } from '../helpers/superRefine';

const formSchema = z
	.object({
		projectName: z.string().min(2, {
			message: 'Project Name must be at least 2 characters.',
		}),
		...projectDetailsSchema,
	})
	.superRefine((data, ctx) => {
		exampleRefine(data, ctx);
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
			fileUpload: [],
		},
	});

	const watchedValues = form.watch();

	const [layoutType, productType] = useWatch({
		control: form.control,
		name: ['layoutType', 'productType'],
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
				<Main form={form} productType={productType} />

				<Sidebar watchedValues={watchedValues} />
			</form>
		</Form>
	);
}
