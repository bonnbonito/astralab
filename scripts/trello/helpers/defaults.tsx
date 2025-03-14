import { ComponentType as ReactComponentType } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/trello/helpers/schema';
import SidebarADA from '@/trello/components/products/ADA/SidebarADA';
import SidebarMonuments from '@/trello/components/products/MonumentsAndPylons/SidebarMonuments';
import SidebarChannelLetters from '@/trello/components/products/ChannelLetters/SidebarChannelLetters';
import SidebarDimensionalLetters from '@/trello/components/products/DimensionalLetters/SidebarDimensionalLetters';
import SidebarLightbox from '@/trello/components/products/Lightbox/SidebarLightbox';
import SidebarCustomJob from '@/trello/components/products/CustomJob/SidebarCustomJob';
import SidebarVehicleWrap from '@/trello/components/products/VehicleWrap/SidebarVehicleWrap';
import SidebarWallVinyl from '@/trello/components/products/WallVinyl/SidebarWallVinyl';
import SidebarPrintCut from '@/trello/components/products/PrintCut/SidebarPrintCut';
import SidebarLogoDesign from '@/trello/components/products/LogoDesign/SidebarLogoDesign';
type SidebarComponent = ReactComponentType<{ form: UseFormReturn<FormSchema> }>;

interface ComponentConfig {
	fieldName: string;
	sidebar: SidebarComponent;
}

// Component map with strict typing
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
	DimensionalLetters: {
		fieldName: 'hasDimensionalLetters',
		sidebar: SidebarDimensionalLetters,
	},
	Lightbox: {
		fieldName: 'hasLightbox',
		sidebar: SidebarLightbox,
	},
	VehicleWrap: {
		fieldName: 'hasVehicleWrap',
		sidebar: SidebarVehicleWrap,
	},
	CustomJob: {
		fieldName: 'hasCustomJob',
		sidebar: SidebarCustomJob,
	},
	WallVinyl: {
		fieldName: 'hasWallVinyl',
		sidebar: SidebarWallVinyl,
	},
	PrintCut: {
		fieldName: 'hasPrintCut',
		sidebar: SidebarPrintCut,
	},
	LogoDesign: {
		fieldName: 'hasLogoDesign',
		sidebar: SidebarLogoDesign,
	},
} as const satisfies Record<string, ComponentConfig>;

export type ComponentType = keyof typeof COMPONENT_MAP;

// Generate default form values based on component fields
const generateDefaultFormValues = () => {
	const componentDefaults = Object.values(COMPONENT_MAP).reduce(
		(acc, { fieldName }) => ({
			...acc,
			[fieldName]: false,
		}),
		{}
	);

	return {
		projectName: '',
		turnaroundTime: '',
		designDetails: '',
		projectDescription: '',
		layoutType: '',
		productType: {},
		fileUpload: [],
		...componentDefaults,
	} as const;
};

export const defaultValues = generateDefaultFormValues();

// Type for the form default values
export type DefaultValues = typeof defaultValues;
