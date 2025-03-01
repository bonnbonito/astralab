/**
 * Temporary Login Link functionality
 */
(function () {
	'use strict';

	// Define global astralabTempLogin to prevent linter errors
	/* global astralabTempLogin */

	document.addEventListener('DOMContentLoaded', function () {
		const generateButton = document.getElementById('generate-temp-login');
		const copyButton = document.getElementById('copy-temp-login');
		const resultRow = document.getElementById('temp-login-result-row');
		const linkInput = document.getElementById('temp_login_link');
		const expirySelect = document.getElementById('temp_login_expiry');
		const redirectInput = document.getElementById('temp_login_redirect');
		const spinner = generateButton?.nextElementSibling;

		// Ensure the button exists before proceeding
		if (!generateButton) {
			return;
		}

		// Generate temporary login link
		generateButton.addEventListener('click', function () {
			const userId = this.getAttribute('data-user-id');

			// Get values with type safety
			let expiry = '3600'; // Default to 1 hours
			if (expirySelect instanceof HTMLSelectElement) {
				expiry = expirySelect.value;
			}

			let redirectTo = '';
			if (redirectInput instanceof HTMLInputElement) {
				redirectTo = redirectInput.value;
			}

			// Show spinner
			if (spinner && spinner.style) {
				spinner.style.visibility = 'visible';
			}

			// Disable button during request
			if (generateButton.disabled !== undefined) {
				generateButton.disabled = true;
			}

			// Make AJAX request
			const xhr = new XMLHttpRequest();
			xhr.open('POST', astralabTempLogin.ajaxUrl, true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

			xhr.onload = function () {
				// Hide spinner
				if (spinner && spinner.style) {
					spinner.style.visibility = 'hidden';
				}

				// Re-enable button
				if (generateButton.disabled !== undefined) {
					generateButton.disabled = false;
				}

				if (xhr.status === 200) {
					try {
						const response = JSON.parse(xhr.responseText);

						if (response.success) {
							// Show result row
							if (resultRow && resultRow.style) {
								resultRow.style.display = 'table-row';
							}

							// Set link in input
							if (linkInput && linkInput.value !== undefined) {
								linkInput.value = response.data.link;
							}
						} else {
							// Show error message
							const errorMsg =
								response.data && response.data.message
									? response.data.message
									: 'Unknown error';
							alert('Error: ' + errorMsg);
						}
					} catch (e) {
						const errorMsg =
							e && typeof e === 'object' && 'message' in e
								? e.message
								: 'Unknown error';
						alert('Error parsing response: ' + errorMsg);
					}
				} else {
					alert('Request failed. Status: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				// Hide spinner
				if (spinner && spinner.style) {
					spinner.style.visibility = 'hidden';
				}

				// Re-enable button
				if (generateButton.disabled !== undefined) {
					generateButton.disabled = false;
				}

				alert('Request failed. Please try again.');
			};

			// Prepare data
			const data =
				'action=generate_temp_login_link' +
				'&nonce=' +
				encodeURIComponent(astralabTempLogin.nonce) +
				'&user_id=' +
				encodeURIComponent(userId || '') +
				'&expiry=' +
				encodeURIComponent(expiry) +
				'&redirect_to=' +
				encodeURIComponent(redirectTo);

			// Send request
			xhr.send(data);
		});

		// Copy link to clipboard
		if (copyButton && linkInput) {
			copyButton.addEventListener('click', function () {
				if (linkInput instanceof HTMLInputElement) {
					// Select the text
					linkInput.select();
					linkInput.setSelectionRange(0, 99999); // For mobile devices

					// Copy to clipboard
					try {
						document.execCommand('copy');

						// Change button text temporarily
						const originalText = this.textContent || 'Copy Link';
						this.textContent = 'Copied!';

						// Reset button text after 2 seconds
						setTimeout(() => {
							this.textContent = originalText;
						}, 2000);
					} catch (err) {
						const errorMsg =
							err && typeof err === 'object' && 'message' in err
								? err.message
								: 'Unknown error';
						alert('Failed to copy: ' + errorMsg);
					}
				}
			});
		}
	});
})();
