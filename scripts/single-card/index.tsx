import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';
import App from './components/App';

domReady(() => {
	const commentCard = document.getElementById('comment-card');
	if (commentCard) {
		const root = createRoot(commentCard);
		root.render(<App />);
	}
});
