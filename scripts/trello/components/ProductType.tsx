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

interface ProductTypeProps {
	form: any; // If using React Hook Form, prefer UseFormReturn<YourFormValues>
}

declare const astralab: any;

export default function ProductType({ form }: ProductTypeProps) {
	const [productTypes, setProductTypes] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchProductTypes() {
			try {
				const response = await fetch(astralab['product-types']);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data = await response.json();
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
		<div className="border px-4 py-6 mb-8 rounded">
			<FormField
				control={form.control}
				name="productType"
				render={() => (
					<FormItem>
						<FormLabel className="uppercase font-medium">
							Product Type
						</FormLabel>
						<FormControl>
							<div className="grid grid-cols-3 gap-6">
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
								) : productTypes?.length > 0 ? (
									productTypes.map(
										(post: {
											id: number;
											title: { rendered: string };
											featured_media_url: string;
											acf: { component: string };
										}) => {
											const productTypeObj =
												form.getValues('productType') || {};
											// If a key exists for this post.id, it's considered 'checked'
											const isChecked = Boolean(productTypeObj[post.id]);

											return (
												<div key={`prodtype-${post.id}`}>
													<div className="flex items-start justify-between gap-4">
														<Checkbox
															id={`prodtype-${post.id}`}
															checked={isChecked}
															onCheckedChange={(checked) => {
																const updatedProductType = {
																	...productTypeObj,
																};

																if (checked) {
																	/*
                                    If checked, set the key to an object:
                                    { title: "ADA Wayfinding" }
                                  */
																	updatedProductType[post.id] = {
																		title: post.title.rendered,
																	};
																} else {
																	/*
                                    If unchecked, remove the key completely.
                                  */
																	delete updatedProductType[post.id];
																}

																// Save back to form
																form.setValue(
																	'productType',
																	updatedProductType
																);

																// Handle productComponent
																const productComponentCurrent =
																	form.getValues('productComponent') || [];
																let newProductComponent = [
																	...productComponentCurrent,
																];

																if (checked) {
																	newProductComponent.push(post.acf.component);
																} else {
																	newProductComponent =
																		newProductComponent.filter(
																			(item) => item !== post.acf.component
																		);
																}
																form.setValue(
																	'productComponent',
																	newProductComponent
																);

																// Handle productId
																const productIdCurrent =
																	form.getValues('productId') || [];
																let newProductId = [...productIdCurrent];

																if (checked) {
																	newProductId.push(post.id);
																} else {
																	newProductId = newProductId.filter(
																		(item) => item !== post.id
																	);
																}
																form.setValue('productId', newProductId);
															}}
															className="p-0 border-solid bg-transparent"
														/>
														<Label
															htmlFor={`prodtype-${post.id}`}
															className="cursor-pointer uppercase font-medium text-sm"
															dangerouslySetInnerHTML={{
																__html: post.title.rendered,
															}}
														/>
													</div>

													<Label
														htmlFor={`prodtype-${post.id}`}
														className="cursor-pointer uppercase font-medium text-sm"
													>
														<img
															src={
																post.featured_media_url ||
																'placeholder-image-url'
															}
															alt={post.title.rendered}
															className="object-cover mt-2 rounded-md w-full"
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
