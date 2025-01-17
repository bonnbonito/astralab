export interface DashboardContextType {
	tabActive: string;
	setTabActive: (tab: string) => void;
	trelloCards: AstralabDashboard['cards'];
	setTrelloCards: (cards: AstralabDashboard['cards']) => void;
	filterCards: (filter: string) => void;
}

export interface AstralabDashboard {
	cards: {
		id: number;
		title: string;
		date: string;
		meta: {
			trello_card_list?: string[];
			trello_card_comment_count?: string[];
			trello_card_activities: string[];
			[key: string]: unknown;
		};
	}[];
}
