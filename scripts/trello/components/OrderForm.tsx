'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
	formSchema,
	formDefaultValues,
	FormSchema,
} from '@/trello/helpers/schema';

import { Form } from '@/components/ui/form';

import Sidebar from './Sidebar';
import Main from './Main';
import { Astralab } from '@/trello/helpers/types';
import axios from 'axios';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

declare const astralab: Astralab;

export default function OrderForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: formDefaultValues,
	});

	const { toast } = useToast();

	const appendToFormData = (formData: FormData, key: string, value: any) => {
		if (value instanceof File) {
			// Handle file uploads
			formData.append(key, value, value.name);
		} else if (Array.isArray(value)) {
			// Handle arrays
			value.forEach((item, index) => {
				if (typeof item === 'object' && item !== null) {
					appendToFormData(formData, `${key}[${index}]`, item);
				} else {
					formData.append(`${key}[${index}]`, item);
				}
			});
		} else if (typeof value === 'object' && value !== null) {
			// Handle nested objects
			for (const subKey in value) {
				if (value.hasOwnProperty(subKey)) {
					appendToFormData(formData, `${key}[${subKey}]`, value[subKey]);
				}
			}
		} else {
			// Handle simple key-value pairs
			formData.append(key, value);
		}
	};

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		const formData = new FormData();
		formData.append('action', 'astralab_form_submission');
		formData.append('astralab_nonce', astralab.nonce);

		// Append all data to FormData
		Object.entries(data).forEach(([key, value]) => {
			appendToFormData(formData, key, value);
		});

		try {
			const response = await axios.post(astralab.ajax_url, formData);

			if (response.data.success === true) {
				console.log('Success:', response.data);
				form.reset();
				toast({
					title: 'Order placed successfully',
				});
			} else {
				console.error('Error:', response.data);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	useEffect(() => {
		const errors = form.formState.errors;
		const errorCount = Object.keys(errors).length;

		if (errorCount > 0) {
			const firstError = Object.entries(errors)[0];
			const [fieldName, error] = firstError;

			console.log(error);

			toast({
				variant: 'destructive',
				title: `${error.message || 'Fill all the required fields.'}`,
			});
		}
	}, [form.formState.errors, toast]);

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="md:flex gap-9">
					<Main form={form} />

					<Sidebar form={form} />
				</form>
			</Form>
			<Toaster />
		</>
	);
}
