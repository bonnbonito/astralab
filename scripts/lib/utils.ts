import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const decodeHTMLEntities = (text: string) => {
	const textarea = document.createElement('textarea');
	textarea.innerHTML = text;
	return textarea.value;
};
