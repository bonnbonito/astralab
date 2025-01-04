'use client';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { formSchema, formDefaultValues, FormSchema } from '../helpers/schema';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import ProductType from './ProductType';
import { Astralab, Options } from '../helpers/types';
import Sidebar from './Sidebar';
import Main from './Main';

declare const astralab: Astralab;

const defaultOptions: Options = {
	turnaround_time: [],
	layout_types: [],
	design_details: [],
};

export default function OrderForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: formDefaultValues,
	});

	const onSubmit: SubmitHandler<FormSchema> = (data) => {
		console.log(data);
	};

	const [options, setOptions] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchOptions() {
			try {
				const response = await fetch(astralab.options);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
				setOptions(data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching options:', error);
				setLoading(false);
			}
		}

		fetchOptions();
	}, []);

	const typedOptions: Options = options ? (options as Options) : defaultOptions;

	const turnaroundTimeOptions = (typedOptions.turnaround_time || []).map(
		(item) => {
			if (typeof item === 'string') {
				return { name: item };
			}
			return item;
		}
	) as { name: string }[];
	const layoutTypeOptions = (typedOptions.layout_types || []).map((item) => {
		if (typeof item === 'string') {
			return { title: item, image: { url: '' } };
		}
		return item;
	}) as { title: string; image: { url: string } }[];
	const designDetailsOptions = typedOptions?.design_details || [];

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="md:flex gap-9">
				<Main form={form} />

				<Sidebar form={form} />
			</form>
		</Form>
	);
}
