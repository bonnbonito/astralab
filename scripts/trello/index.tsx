import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';
import './style.scss';

import App from './components/App';

domReady(() => {
	test_submit();
	comment_submit();

	const trelloForm = document.getElementById('trelloForm');
	if (trelloForm) {
		const root = createRoot(trelloForm);
		root.render(<App />);
	} else {
		console.error('Root element with id "test" not found');
	}
});

function comment_submit() {
	const form = document.getElementById('trello-comment-form');
	const responseDiv = document.getElementById('trello-comment-response');

	form?.addEventListener('submit', function (e) {
		e.preventDefault();

		const formData = new FormData(form);
		formData.append('action', 'handle_trello_comment_submission');
		formData.append('trello_form_nonce', trello_ajax_object.trello_form_nonce);

		const xhr = new XMLHttpRequest();
		xhr.open('POST', trello_ajax_object.ajax_url, true);

		xhr.onload = function () {
			if (xhr.status === 200) {
				try {
					const response = JSON.parse(xhr.responseText);
					if (response.success) {
						responseDiv.innerHTML = 'Comment updated';
						form.reset();
					} else {
						responseDiv.innerHTML = 'Error: ' + response.data;
					}
				} catch (e) {
					responseDiv.innerHTML = 'An error occurred: Invalid JSON response';
				}
			} else {
				responseDiv.innerHTML = 'An error occurred: ' + xhr.statusText;
			}
		};

		xhr.onerror = function () {
			responseDiv.innerHTML = 'An error occurred during the request.';
		};

		xhr.send(formData);
	});
}

function test_submit() {
	const form = document.getElementById('trello-form');
	const responseDiv = document.getElementById('trello-form-response');

	form?.addEventListener('submit', function (e) {
		e.preventDefault();

		const formData = new FormData(form);
		formData.append('action', 'handle_trello_form_submission');
		formData.append('trello_form_nonce', trello_ajax_object.trello_form_nonce);

		const xhr = new XMLHttpRequest();
		xhr.open('POST', trello_ajax_object.ajax_url, true);

		xhr.onload = function () {
			if (xhr.status === 200) {
				try {
					const response = JSON.parse(xhr.responseText);
					if (response.success) {
						responseDiv.innerHTML = response.data;
						form.reset();
					} else {
						responseDiv.innerHTML = 'Error: ' + response.data;
					}
				} catch (e) {
					responseDiv.innerHTML = 'An error occurred: Invalid JSON response';
				}
			} else {
				responseDiv.innerHTML = 'An error occurred: ' + xhr.statusText;
			}
		};

		xhr.onerror = function () {
			responseDiv.innerHTML = 'An error occurred during the request.';
		};

		xhr.send(formData);
	});
}
