import SidebarADA from '@/trello/components/products/ADA/SidebarADA';
import SidebarMonuments from '@/trello/components/products/MonumentsAndPylons/SidebarMonuments';
import SidebarChannelLetters from '@/trello/components/products/ChannelLetters/SidebarChannelLetters';
import SidebarDimensionalLetters from '@/trello/components/products/DimensionalLetters/SidebarDimensionalLetters';
import SidebarLightbox from '@/trello/components/products/Lightbox/SidebarLightbox';

export const defaultValues = {
	projectName: '',
	turnaroundTime: '',
	designDetails: '',
	projectDescription: '',
	layoutType: '',
	productType: {},
	fileUpload: [],
	hasADA: false,
};

export type ComponentType = keyof typeof COMPONENT_MAP;

export const COMPONENT_MAP = {
	ADAWayfinding: {
		fieldName: 'hasADA',
		sidebar: SidebarADA,
	},
	MonumentsAndPylons: {
		fieldName: 'hasMonumentsAndPylons',
		sidebar: SidebarMonuments,
	},
	ChannelLetters: {
		fieldName: 'hasChannelLetters',
		sidebar: SidebarChannelLetters,
	},
	Lightbox: {
		fieldName: 'hasLightbox',
		sidebar: SidebarChannelLetters,
	},
	DimensionalLetters: {
		fieldName: 'hasDimensionalLetters',
		sidebar: SidebarDimensionalLetters,
	},
};
