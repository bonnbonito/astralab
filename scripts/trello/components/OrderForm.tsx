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
import { defaultValues } from '../helpers/defaults';
import { adaRefine } from './products/ADA/adaRefine';

const formSchema = z
	.object({
		projectName: z.string().min(2, {
			message: 'Project Name must be at least 2 characters.',
		}),
		...projectDetailsSchema,
	})
	.superRefine((data, ctx) => {
		exampleRefine(data, ctx);
		adaRefine(data, ctx);
	});

export default function OrderForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues,
	});

	const watchedValues = form.watch();

	const [layoutType, productType, productComponent, productId] = useWatch({
		control: form.control,
		name: ['layoutType', 'productType', 'productComponent', 'productId'],
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		console.log(watchedValues, 'Tewr');
	}

	// Automatically remove productType values if layoutType is "option2"
	useEffect(() => {
		// if (layoutType === 'Layout 2') {
		// 	form.setValue('productType', ['ADA Wayfinding']);
		// } else {
		// 	form.setValue('productType', []);
		// }
	}, [layoutType, form]);

	return (
		<Form {...form}>
			<h3 className="text-[30px]">PROJECT DETAILS</h3>
			<form onSubmit={form.handleSubmit(onSubmit)} className="md:flex gap-9">
				<Main
					form={form}
					productComponent={productComponent}
					productId={productId}
					watchedValues={watchedValues}
				/>

				<Sidebar watchedValues={watchedValues} />
			</form>
		</Form>
	);
}
