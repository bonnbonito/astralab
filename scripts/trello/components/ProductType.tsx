import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Astralab, ProductTypeProps } from '@/trello/helpers/types';
import { COMPONENT_MAP } from '@/trello/helpers/defaults';
import { FormSchema } from '@/trello/helpers/schema';

declare const astralab: Astralab;

type ProductType = {
	id: number;
	title: { rendered: string };
	featured_media_url: string;
	acf: { component: keyof typeof COMPONENT_MAP };
};

export default function ProductType({ form }: ProductTypeProps) {
	// Initialize productTypes with an empty array of the defined type
	const [productTypes, setProductTypes] = useState<ProductType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchProductTypes() {
			try {
				const response = await fetch(astralab['product-types']);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data = await response.json();
				// Sort data by ascending id
				data.sort((a: ProductType, b: ProductType) => a.id - b.id);
				setProductTypes(data);
			} catch (error) {
				console.error('Error fetching product types:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchProductTypes();
	}, []);

	return (
		<div className="border border-input px-4 py-6 mb-8 rounded">
			<FormField
				control={form.control}
				name="productTypes"
				render={() => (
					<FormItem>
						<FormLabel className="uppercase font-semibold text-base">
							Product Type
						</FormLabel>
						<FormControl>
							<div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-6">
								{loading ? (
									Array.from({ length: 3 }).map((_, index) => (
										<div className="flex flex-col space-y-3" key={index}>
											<div className="space-y-2">
												<Skeleton className="h-4 w-full" />
											</div>
											<Skeleton className="h-[150px] w-full rounded-xl" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-full" />
											</div>
										</div>
									))
								) : productTypes && productTypes.length > 0 ? (
									productTypes.map(
										(post: {
											id: number;
											title: { rendered: string };
											featured_media_url: string;
											acf: { component: keyof typeof COMPONENT_MAP };
										}) => {
											const productTypeArray =
												form.getValues('productTypes') || [];
											const isChecked = productTypeArray.some(
												(item) => item.id === post.id
											);

											return (
												<div key={`prodtype-${post.id}`}>
													<div className="flex items-start justify-between gap-4">
														<Checkbox
															id={`prodtype-${post.id}`}
															checked={isChecked}
															onCheckedChange={(checked) => {
																const fieldName = COMPONENT_MAP[
																	post.acf.component
																].fieldName as keyof FormSchema;

																form.setValue(
																	fieldName,
																	checked ? true : false
																);

																const updatedProductTypes = checked
																	? [
																			...productTypeArray,
																			{
																				title: post.title.rendered,
																				component: post.acf.component,
																				id: post.id,
																			},
																	  ]
																	: productTypeArray.filter(
																			(item) => item.id !== post.id
																	  );

																form.setValue(
																	'productTypes',
																	updatedProductTypes
																);
																form.trigger('productTypes');
															}}
															className="p-0 border-input border-solid bg-transparent"
														/>
														<Label
															htmlFor={`prodtype-${post.id}`}
															className="cursor-pointer uppercase font-semibold text-sm"
															dangerouslySetInnerHTML={{
																__html: post.title.rendered,
															}}
														/>
													</div>

													<Label
														htmlFor={`prodtype-${post.id}`}
														className="cursor-pointer uppercase font-semibold text-sm"
													>
														<img
															src={
																post.featured_media_url ||
																'placeholder-image-url'
															}
															alt={post.title.rendered}
															className="object-cover mt-2 rounded-md w-full aspect-[4/3]"
														/>
													</Label>
												</div>
											);
										}
									)
								) : (
									<p>No product types available</p>
								)}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
