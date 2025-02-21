import { ReactNode } from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { SkeletonCard } from '@/trello/components/SkeletonCard';
import { decodeHTMLEntities } from '@/lib/utils';

interface AccordionProductTypeProps {
	product: number;
	loading: boolean;
	title?: string;
	children: ReactNode;
}

export default function AccordionProductType({
	product,
	loading,
	title,
	children,
}: AccordionProductTypeProps) {
	return (
		<Accordion
			type="single"
			collapsible
			defaultValue={product.toString()}
			className="border border-input border-solid rounded"
		>
			<AccordionItem value={product.toString()}>
				<AccordionTrigger className="uppercase bg-transparent mb-0 text-[26px] font-medium shadow-none hover:no-underline [&>svg]:h-6 [&>svg]:w-6 pl-4">
					{loading
						? 'Loading...'
						: title
						? decodeHTMLEntities(title)
						: 'No Data Available'}
				</AccordionTrigger>
				<AccordionContent>
					{loading ? <SkeletonCard /> : children}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
