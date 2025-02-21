import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';

interface LayoutImageProps {
	image: string;
	title: string;
}

export default function LayoutImage({ image, title }: LayoutImageProps) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="relative">
			<Lightbox
				open={isOpen}
				close={() => setIsOpen(false)}
				controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
				slides={[{ src: image, title: title }]}
				render={{
					buttonPrev: () => null,
					buttonNext: () => null,
				}}
				carousel={{ swipe: false, finite: true }}
				plugins={[Captions]}
				captions={{
					showToggle: true,
					descriptionTextAlign: 'center',
				}}
			/>
			<img
				src={image}
				alt="Layout Image"
				className="object-cover mb-2 w-full aspect-[4/3] cursor-pointer"
				onClick={() => setIsOpen(true)}
			/>
		</div>
	);
}
