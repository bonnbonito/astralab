/**
 * JavaScript for recreating Trello board
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		const recreateButton = document.getElementById('recreate-trello-board');
		const modal = document.getElementById('trello-confirm-modal');
		const cancelButton = document.getElementById('trello-confirm-cancel');
		const proceedButton = document.getElementById('trello-confirm-proceed');

		if (!recreateButton) {
			return;
		}

		// Function to handle the actual AJAX request
		function sendTrelloRequest(userId) {
			const spinner = recreateButton.nextElementSibling;
			const button = recreateButton;

			// Check if all required elements and data exist
			if (!userId || !spinner || typeof window.astralabTrello === 'undefined') {
				console.error('Missing required data for Trello board recreation');
				return;
			}

			// Disable button and show spinner
			if (button instanceof HTMLButtonElement) {
				button.disabled = true;
			}

			// Set spinner visibility
			if (spinner instanceof HTMLElement) {
				spinner.style.visibility = 'visible';
			}

			// Create form data
			const formData = new FormData();
			formData.append('action', 'recreate_trello_board');
			formData.append('user_id', userId);
			formData.append('nonce', window.astralabTrello.nonce);

			// Send AJAX request
			fetch(window.astralabTrello.ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				body: formData,
			})
				.then((response) => {
					// Check if response is ok
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}

					// Check content type to ensure it's JSON
					const contentType = response.headers.get('content-type');
					if (!contentType || !contentType.includes('application/json')) {
						throw new Error('Response is not JSON');
					}

					return response.json();
				})
				.then((data) => {
					// Re-enable button and hide spinner
					if (button instanceof HTMLButtonElement) {
						button.disabled = false;
					}

					// Hide spinner
					if (spinner instanceof HTMLElement) {
						spinner.style.visibility = 'hidden';
					}

					// Show notification
					const notice = document.createElement('div');
					notice.className = data.success
						? 'notice notice-success is-dismissible'
						: 'notice notice-error is-dismissible';

					const paragraph = document.createElement('p');

					// Handle different response formats
					let message = 'Operation completed';
					if (data.data && data.data.message) {
						message = data.data.message;
					} else if (data.message) {
						message = data.message;
					}

					paragraph.textContent = message;
					notice.appendChild(paragraph);

					// Add details about board deletion if available
					if (data.success && data.data && data.data.result) {
						const result = data.data.result;

						if (result.old_board_id) {
							const detailsPara = document.createElement('p');
							let detailsText = `Old board ID: ${result.old_board_id}`;

							if (result.old_board_exists === false) {
								detailsText += ' (board did not exist on Trello)';
							} else if (result.old_board_deleted) {
								detailsText += ' - Successfully deleted';
							} else if (result.old_board_delete_error) {
								detailsText += ` - Deletion failed: ${result.old_board_delete_error}`;
							}

							detailsPara.textContent = detailsText;
							detailsPara.style.fontSize = '0.9em';
							detailsPara.style.opacity = '0.8';
							notice.appendChild(detailsPara);
						}
					}

					// Add dismiss button
					const dismissButton = document.createElement('button');
					dismissButton.type = 'button';
					dismissButton.className = 'notice-dismiss';
					dismissButton.innerHTML =
						'<span class="screen-reader-text">Dismiss this notice.</span>';
					dismissButton.addEventListener('click', function () {
						notice.remove();
					});

					notice.appendChild(dismissButton);

					// Insert notice at the top of the form
					const section = document.querySelector('.recreate-trello-section');
					const form = section ? section.closest('form') : null;

					if (form) {
						form.insertBefore(notice, form.firstChild);

						// Scroll to notice
						window.scrollTo({
							top: notice.offsetTop - 50,
							behavior: 'smooth',
						});

						// Auto-remove notice after 5 seconds
						setTimeout(() => {
							if (document.body.contains(notice)) {
								notice.remove();
							}
						}, 5000);

						// If operation was successful and we have board data, update the UI
						if (data.success && data.data && data.data.result) {
							const result = data.data.result;

							// Update button text if needed
							if (result.board_id) {
								// Reload the page to show updated board information
								setTimeout(() => {
									window.location.reload();
								}, 2000);
							}
						}
					}
				})
				.catch((error) => {
					console.error('Error:', error);

					// Re-enable button and hide spinner
					if (button instanceof HTMLButtonElement) {
						button.disabled = false;
					}

					// Hide spinner
					if (spinner instanceof HTMLElement) {
						spinner.style.visibility = 'hidden';
					}

					// Show error notification
					const notice = document.createElement('div');
					notice.className = 'notice notice-error is-dismissible';

					const paragraph = document.createElement('p');
					paragraph.textContent =
						'An error occurred while processing your request: ' + error.message;

					notice.appendChild(paragraph);

					// Add dismiss button
					const dismissButton = document.createElement('button');
					dismissButton.type = 'button';
					dismissButton.className = 'notice-dismiss';
					dismissButton.innerHTML =
						'<span class="screen-reader-text">Dismiss this notice.</span>';
					dismissButton.addEventListener('click', function () {
						notice.remove();
					});

					notice.appendChild(dismissButton);

					// Insert notice at the top of the form
					const section = document.querySelector('.recreate-trello-section');
					const form = section ? section.closest('form') : null;

					if (form) {
						form.insertBefore(notice, form.firstChild);

						// Scroll to notice
						window.scrollTo({
							top: notice.offsetTop - 50,
							behavior: 'smooth',
						});
					}
				});
		}

		// Handle recreate button click
		recreateButton.addEventListener('click', function (e) {
			e.preventDefault();

			const userId = this.getAttribute('data-user-id');

			// Check if button text contains 'recreate' to determine if we're recreating or creating
			const buttonText = this.textContent || '';
			const isRecreating = buttonText.trim().toLowerCase().includes('recreate');

			// If recreating, show confirmation modal
			if (isRecreating && modal) {
				// Store the user ID in the proceed button's data attribute
				if (proceedButton) {
					proceedButton.setAttribute('data-user-id', userId);
				}

				// Show the modal
				modal.style.display = 'block';
			} else {
				// If creating a new board (not recreating), proceed without confirmation
				sendTrelloRequest(userId);
			}
		});

		// Handle cancel button click
		if (cancelButton) {
			cancelButton.addEventListener('click', function () {
				if (modal) {
					modal.style.display = 'none';
				}
			});
		}

		// Handle proceed button click
		if (proceedButton) {
			proceedButton.addEventListener('click', function () {
				const userId = this.getAttribute('data-user-id');

				// Hide the modal
				if (modal) {
					modal.style.display = 'none';
				}

				// Proceed with the request
				if (userId) {
					sendTrelloRequest(userId);
				}
			});
		}

		// Close the modal when clicking outside of it
		if (modal) {
			window.addEventListener('click', function (event) {
				if (event.target === modal) {
					modal.style.display = 'none';
				}
			});
		}
	});
})();

// Make astralabTrello available globally
// This is a runtime declaration, not a TypeScript declaration
window.astralabTrello = window.astralabTrello || { ajaxUrl: '', nonce: '' };
