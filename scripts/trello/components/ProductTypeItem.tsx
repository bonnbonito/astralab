import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { COMPONENT_MAP } from '@/trello/helpers/defaults';
import { FormSchema } from '@/trello/helpers/schema';
import { UseFormReturn } from 'react-hook-form';
import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductTypes } from '../hooks/useProductTypes';

interface ProductTypeItemProps {
	form: UseFormReturn<FormSchema>;
}

function ProductTypeItem({ form }: ProductTypeItemProps) {
	const { productTypes, loading } = useProductTypes();
	return (
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
						const productTypeArray = form.getValues('productTypes') || [];
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
											const fieldName = COMPONENT_MAP[post.acf.component]
												.fieldName as keyof FormSchema;

											form.setValue(fieldName, checked ? true : false);

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

											form.setValue('productTypes', updatedProductTypes);
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
										src={post.featured_media_url || 'placeholder-image-url'}
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
	);
}

export default memo(ProductTypeItem);
