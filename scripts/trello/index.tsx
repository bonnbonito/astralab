import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';
import './style.scss';

import OrderForm from './components/OrderForm';

domReady(() => {
	test_submit();
	comment_submit();

	const orderForm = document.getElementById('orderForm');
	if (orderForm) {
		const root = createRoot(orderForm);
		root.render(<OrderForm />);
	} else {
		console.error('Root element with id "test" not found');
	}
});

async function submitForm(
	form: HTMLFormElement,
	action: string,
	responseDiv: HTMLElement
) {
	try {
		const formData = new FormData(form);
		formData.append('action', action);
		formData.append('trello_form_nonce', trello_ajax_object.trello_form_nonce);

		const response = await fetch(trello_ajax_object.ajax_url, {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		if (data.success) {
			responseDiv.innerHTML = data.data || 'Success';
			form.reset();
		} else {
			responseDiv.innerHTML = 'Error: ' + data.data;
		}
	} catch (error) {
		responseDiv.innerHTML = `An error occurred: ${error.message}`;
	}
}

function comment_submit() {
	const form = document.getElementById(
		'trello-comment-form'
	) as HTMLFormElement;
	const responseDiv = document.getElementById(
		'trello-comment-response'
	) as HTMLElement;

	form?.addEventListener('submit', function (e) {
		e.preventDefault();
		submitForm(form, 'handle_trello_comment_submission', responseDiv);
	});
}

function test_submit() {
	const form = document.getElementById('trello-form') as HTMLFormElement;
	const responseDiv = document.getElementById(
		'trello-form-response'
	) as HTMLElement;

	form?.addEventListener('submit', function (e) {
		e.preventDefault();
		submitForm(form, 'handle_trello_form_submission', responseDiv);
	});
}
