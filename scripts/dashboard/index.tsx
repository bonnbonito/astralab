import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';
import App from './components/App';

domReady(() => {
	const dashboardComponent = document.getElementById('dashboardComponent');
	if (dashboardComponent) {
		const root = createRoot(dashboardComponent);
		root.render(<App />);
	} else {
		console.error('Root element with id "test" not found');
	}
});
