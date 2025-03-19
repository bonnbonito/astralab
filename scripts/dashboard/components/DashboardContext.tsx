import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import {
	AstralabDashboard,
	DashboardContextType,
} from '@/dashboard/helpers/types';

const Dashboard = createContext<DashboardContextType>(
	{} as DashboardContextType
);

export const useDashboard = () => useContext(Dashboard);

export const DashboardContext = ({ children }: { children: ReactNode }) => {
	const [tabActive, setTabActive] = useState<string>('All');
	const [trelloCards, setTrelloCards] = useState<AstralabDashboard['cards']>(
		() => {
			const dashboard = (window as { astralabDashboard?: AstralabDashboard })
				?.astralabDashboard;
			return dashboard?.cards ?? [];
		}
	);

	const filterCards = (filter: string) => {
		setTabActive(filter);
		const dashboard = (window as { astralabDashboard?: AstralabDashboard })
			?.astralabDashboard;
		const cards = dashboard?.cards ?? [];

		setTrelloCards(
			filter === 'All'
				? cards
				: filter === 'Recently Updated'
				? [...cards].sort(
						(a, b) =>
							new Date(b.date_updated).getTime() -
							new Date(a.date_updated).getTime()
				  )
				: filter === 'Doing' || filter === 'In Progress'
				? cards.filter(
						(card) => card.meta.trello_card_list?.[0] === 'In Progress'
				  )
				: filter === 'Completed' || filter === 'Done'
				? cards.filter(
						(card) => card.meta.trello_card_list?.[0] === 'Completed'
				  )
				: cards.filter((card) => card.meta.trello_card_list?.[0] === filter)
		);
	};

	useEffect(() => {}, [trelloCards]);

	return (
		<Dashboard.Provider
			value={{
				tabActive,
				setTabActive,
				trelloCards,
				setTrelloCards,
				filterCards,
			}}
		>
			{children}
		</Dashboard.Provider>
	);
};
