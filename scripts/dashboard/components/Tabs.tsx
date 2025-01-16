import { useDashboard } from './DashboardContext';

export default function Tabs() {
	const { filterCards, tabActive } = useDashboard();

	const tabsArray = ['All', 'Recently Updated', 'To Do', 'Doing', 'Done'];

	return (
		<div className="mt-2 flex no-wrap justify-between border-b-[#D2D2D2] border-b uppercase overflow-x-auto mb-8">
			{tabsArray.map((tabName) => (
				<div
					key={tabName}
					className={`px-6 py-2 text-center cursor-pointer border whitespace-nowrap font-semibold ${
						tabActive === tabName
							? 'border-t-[#D2D2D2] border-x-[#D2D2D2]'
							: 'border-transparent border-b-0'
					}`}
					onClick={() => filterCards(tabName)}
				>
					{tabName}
				</div>
			))}
		</div>
	);
}
