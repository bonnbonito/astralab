import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';

import './main.css';

import App from './components/App';

domReady(() => {
	const testElement = document.getElementById('test');
	if (testElement) {
		const root = createRoot(testElement);
		root.render(<App />);
	} else {
		// console.error('Root element with id "test" not found');
	}
});
