import Row from './Row';
import Tabs from './Tabs';
import { DashboardContext } from './DashboardContext';

export default function App() {
	return (
		<DashboardContext>
			<Tabs />
			<div className="grid grid-cols-1 gap-4">
				<Row />
			</div>
		</DashboardContext>
	);
}
