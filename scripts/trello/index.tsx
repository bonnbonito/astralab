import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';
import './style.scss';

import OrderForm from './components/OrderForm';

domReady(() => {
	comment_submit();

	const orderForm = document.getElementById('orderForm');
	if (orderForm) {
		const root = createRoot(orderForm);
		root.render(<OrderForm />);
	}
});

declare const trello_ajax_object: any;

async function submitForm(
	form: HTMLFormElement,
	action: string,
	responseDiv: HTMLElement,
	submitBtn: HTMLElement
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

		console.log(data);

		if (data.success) {
			responseDiv.innerHTML =
				(data.data.message || 'Success') + '<br/>Reloading in 2...';
			form.reset();

			// Countdown and reload
			setTimeout(() => {
				responseDiv.innerHTML = responseDiv.innerHTML.replace('2...', '1...');
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			}, 1000);
		} else {
			responseDiv.innerHTML = 'Error: ' + data.data;
		}
	} catch (error) {
		// Narrow the error type
		if (error instanceof Error) {
			responseDiv.innerHTML = `An error occurred: ${error.message}`;
		} else {
			// Fallback for unexpected error types
			responseDiv.innerHTML = 'An unknown error occurred.';
			console.error('Unexpected error:', error);
		}
	}
}

function comment_submit() {
	const form = document.getElementById(
		'trello-comment-form'
	) as HTMLFormElement;
	const responseDiv = document.getElementById(
		'trello-comment-response'
	) as HTMLElement;

	const submitBtn = form?.querySelector('#submitBtn') as HTMLInputElement;

	if (submitBtn) {
		form?.addEventListener('submit', async function (e) {
			e.preventDefault(); // Prevent default form submission
			submitBtn.disabled = true;
			submitBtn.value = 'Submitting...';
			await submitForm(
				form,
				'handle_trello_comment_submission',
				responseDiv,
				submitBtn
			);
		});
	}
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
