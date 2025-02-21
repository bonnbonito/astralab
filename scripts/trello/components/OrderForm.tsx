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
import { TooltipProvider } from '@/components/ui/tooltip';

declare const astralab: Astralab;

export default function OrderForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: formDefaultValues,
	});

	const { toast } = useToast();

	const appendToFormData = (formData: FormData, key: string, value: any) => {
		if (value instanceof File) {
			// Handle single file upload for bulkOrderFile
			formData.append(key, value, value.name);
		} else if (Array.isArray(value) && value[0] instanceof File) {
			// Handle multiple file uploads for fileUpload
			value.forEach((file, index) => {
				formData.append(`${key}[${index}]`, file, file.name);
			});
		} else if (Array.isArray(value)) {
			// Handle arrays
			value.forEach((item, index) => {
				if (typeof item === 'object' && item !== null) {
					Object.entries(item).forEach(([itemKey, itemValue]) => {
						formData.append(
							`${key}[${index}][${itemKey}]`,
							typeof itemValue === 'object'
								? JSON.stringify(itemValue)
								: (itemValue as string)
						);
					});
				} else {
					formData.append(`${key}[${index}]`, item);
				}
			});
		} else if (typeof value === 'object' && value !== null) {
			// Handle objects
			Object.entries(value).forEach(([objKey, objValue]) => {
				formData.append(
					`${key}[${objKey}]`,
					typeof objValue === 'object'
						? JSON.stringify(objValue)
						: (objValue as string)
				);
			});
		} else {
			// Handle primitive values
			formData.append(key, value);
		}
	};

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		try {
			const formData = new FormData();
			formData.append('astralab_nonce', astralab.nonce);

			// Append each field to FormData
			Object.entries(data).forEach(([key, value]) => {
				appendToFormData(formData, key, value);
			});

			const response = await axios.post(astralab.ajax_url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				params: {
					action: 'astralab_form_submission',
				},
			});

			if (response.data.success) {
				toast({
					title: 'Success',
					description:
						response.data.data?.message || 'Order placed successfully!',
				});
				form.reset();
			} else {
				throw new Error(response.data.data || 'Failed to submit order');
			}
		} catch (error) {
			console.error('Submission Error:', error);
			// Log the full error object
			if (error.response) {
				console.error('Error Response:', error.response);
				console.error('Error Response Data:', error.response.data);
			}

			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error.response?.data?.message ||
					error.message ||
					'Failed to submit order',
			});
		}
	};

	useEffect(() => {
		const errors = form.formState.errors;
		const errorCount = Object.keys(errors).length;

		if (errorCount > 0) {
			const firstError = Object.entries(errors)[0];
			const [fieldName, error] = firstError;

			console.log(errors);
			// Get first error from nested error object
			const firstErrorObj = Object.values(error)[0];
			const errorMessage =
				firstErrorObj?.message || 'Fill all the required fields.';

			toast({
				variant: 'destructive',
				title: `${error.message || errorMessage}`,
			});
		}
	}, [form.formState.errors, toast]);

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="md:flex gap-9">
					<TooltipProvider delayDuration={100}>
						<Main form={form} />
					</TooltipProvider>

					<Sidebar form={form} />
				</form>
			</Form>
			<Toaster />
		</>
	);
}
