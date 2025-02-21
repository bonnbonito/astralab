<?php

namespace ASTRALAB;

class Trello_Frontend {
	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Option name for Trello settings.
	 *
	 * @var string
	 */
	private $option_name = 'astralab_trello_settings';


	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Class Constructor.
	 */
	public function __construct() {

		// Enqueue scripts for the Trello form
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_trello_vanilla_js_script' ) );

		add_shortcode( 'trello_form', array( $this, 'trello_shortcode' ) );

		// AJAX handlers for creating Trello cards
		add_action( 'wp_ajax_handle_trello_form_submission', array( $this, 'handle_trello_form_submission_ajax' ) );
		add_action( 'wp_ajax_handle_trello_comment_submission', array( $this, 'handle_trello_comment_submission' ) );
	}

	/**
	 * Handle the AJAX request to create trello comment
	 */
	public function handle_trello_comment_submission() {
		// Verify nonce for security
		check_ajax_referer( 'trello_form_action', 'trello_form_nonce' );

		// Get the Trello card ID and comment text from the form
		$card_id = sanitize_text_field( $_POST['card_id'] );
		$card_desc = sanitize_textarea_field( $_POST['card_desc'] );
		$comment_attachment = isset( $_FILES['comment_attachment']['name'] ) ? $_FILES['comment_attachment'] : null;





		if ( empty( $card_id ) || empty( $card_desc ) ) {
			wp_send_json_error( array( 'message' => 'Card ID or Comment is missing.' ) );
		}

		$card_desc = '<h1><strong>Reply:</strong></h1><br><br>' . $card_desc;

		$trello_post = \ASTRALAB\Trello_Post::get_instance();

		if ( $trello_post ) {
			$card_desc = $trello_post->convert_html_to_trello_markup( $card_desc );
		}

		// Get Trello API credentials
		$options = get_option( 'astralab_trello_settings' );
		$api_key = $options['trello_api_key'] ?? '';
		$api_token = $options['trello_api_token'] ?? '';

		if ( empty( $api_key ) || empty( $api_token ) ) {
			wp_send_json_error( array( 'message' => 'Trello API credentials are not configured.' ) );
		}

		if ( ! empty( $comment_attachment['tmp_name'] ) ) {
			$upload_url = 'https://api.trello.com/1/cards/' . $card_id . '/attachments';

			$ch = curl_init();
			curl_setopt( $ch, CURLOPT_URL, $upload_url . '?key=' . $api_key . '&token=' . $api_token );
			curl_setopt( $ch, CURLOPT_POST, true );
			curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
			curl_setopt( $ch, CURLOPT_POSTFIELDS, array(
				'file' => new \CURLFile(
					$comment_attachment['tmp_name'],
					$comment_attachment['type'],
					$comment_attachment['name']
				)
			) );

			$attachment_response = curl_exec( $ch );
			$curl_error = curl_error( $ch );
			curl_close( $ch );

			if ( $curl_error ) {
				error_log( 'Trello attachment upload error: ' . $curl_error );
				wp_send_json_error( 'Error uploading attachment: ' . $curl_error );
			}

			// Decode the attachment response to get the URL
			$attachment_data = json_decode( $attachment_response, true );

			error_log( 'Trello attachment data: ' . print_r( $attachment_data, true ) );

			if ( isset( $attachment_data['url'] ) ) {
				// Add the attachment URL to the card description
				$card_desc .= "\n\n**Attachment:** [" . $comment_attachment['name'] . "](" . $attachment_data['url'] . ")";
			}

			error_log( 'Trello attachment response: ' . print_r( $attachment_response, true ) );
		}

		// API endpoint to add a comment
		$api_url = "https://api.trello.com/1/cards/$card_id/actions/comments";

		$response = wp_remote_post(
			$api_url,
			array(
				'body' => array(
					'key' => $api_key,
					'token' => $api_token,
					'text' => $card_desc,
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			wp_send_json_error( array( 'message' => 'Failed to send comment: ' . $response->get_error_message() ) );
		}

		$response_body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( isset( $response_body['id'] ) ) {
			wp_send_json_success( array( 'message' => 'Comment added successfully! Please refresh the browser.' ) );
		} else {
			wp_send_json_error( array( 'message' => 'Failed to add comment to Trello.' ) );
		}
	}

	/**
	 * Enqueue the JavaScript file and pass variables to it.
	 */
	public function enqueue_trello_vanilla_js_script() {
		wp_enqueue_script(
			'astralab/trello',
			get_template_directory_uri() . '/js/trello-vanilla.js',
			array(),
			null,
			true
		);

		// Localize script to pass AJAX URL and nonce
		wp_localize_script(
			'astralab/trello',
			'trello_ajax_object',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'trello_form_nonce' => wp_create_nonce( 'trello_form_action' ),
			)
		);
	}

	/**
	 * Shortcode callback to display the Trello form.
	 */
	public function trello_shortcode() {
		ob_start();
		?>
		<!-- Trello Form -->
		<form id="trello-form" enctype="multipart/form-data" class="mt-20">
			<?php wp_nonce_field( 'trello_form_action', 'trello_form_nonce' ); ?>

			<label for="card_name">Card Name:</label><br>
			<input type="text" id="card_name" name="card_name" required><br><br>

			<label for="card_desc">Description:</label><br>
			<textarea id="card_desc" name="card_desc"></textarea><br><br>

			<label for="file_upload">Upload Files:</label><br>
			<input type="file" id="file_upload" name="file_upload[]" multiple><br><br>

			<input type="submit" value="Create Trello Card">
		</form>

		<div id="trello-form-response"></div>
		<?php
		return ob_get_clean();
	}


	/**
	 * Handle the AJAX request to create a Trello card and optionally attach files.
	 */
	public function handle_trello_form_submission_ajax() {
		// Verify the nonce
		check_ajax_referer( 'trello_form_action', 'trello_form_nonce' );

		$options = get_option( $this->option_name );
		$api_key = isset( $options['trello_api_key'] ) ? $options['trello_api_key'] : '';
		$api_token = isset( $options['trello_api_token'] ) ? $options['trello_api_token'] : '';

		$list_id = get_user_meta( get_current_user_id(), 'trello_list_id', true );

		if ( empty( $api_key ) || empty( $api_token ) || empty( $list_id ) ) {
			wp_send_json_error( 'Trello API credentials or List ID not set. Please configure them in Trello Settings.' );
		}

		$card_name = sanitize_text_field( $_POST['card_name'] );
		$card_desc = sanitize_textarea_field( $_POST['card_desc'] );

		$user = wp_get_current_user();
		if ( $user && $user->ID ) {
			$full_name = $user->display_name;
			$email = $user->user_email;
		} else {
			$full_name = 'Guest';
			$email = 'N/A';
		}

		$user_line = '**User:** ' . ( ! empty( $full_name ) ? $full_name : 'N/A' );
		$email_line = '**Email:** ' . ( ! empty( $email ) ? $email : 'N/A' );
		$md_desc = $user_line . "\n" . $email_line . "\n\n" . "**Message:**\n" . $card_desc;

		$card_url = 'https://api.trello.com/1/cards';
		$card_args = array(
			'key' => $api_key,
			'token' => $api_token,
			'idList' => $list_id,
			'name' => $card_name,
			'desc' => $md_desc,
		);

		$card_response = wp_remote_post(
			$card_url,
			array(
				'body' => $card_args,
			)
		);

		if ( is_wp_error( $card_response ) ) {
			wp_send_json_error( 'Error creating card: ' . $card_response->get_error_message() );
		}

		$card_body = json_decode( wp_remote_retrieve_body( $card_response ) );

		if ( isset( $card_body->id ) ) {
			$card_id = $card_body->id;

			$post_author = get_current_user_id();
			$post_id = wp_insert_post(
				array(
					'post_type' => 'trello-card',
					'post_title' => $card_name,
					'post_status' => 'publish',
					'post_author' => $post_author,
					'post_content' => $card_desc,
				)
			);

			if ( ! is_wp_error( $post_id ) && $post_id ) {
				update_post_meta( $post_id, 'trello_card_id', $card_id );
				update_post_meta( $post_id, 'trello_card_message', $card_desc );
				update_post_meta( $post_id, 'trello_card_user_name', $full_name );
				update_post_meta( $post_id, 'trello_card_user_email', $email );
			}

			// Handle files
			if ( ! empty( $_FILES['file_upload']['name'][0] ) ) {
				$uploadedfiles = $_FILES['file_upload'];
				$file_count = count( $uploadedfiles['name'] );
				$errors = array();
				$success_count = 0;
				$attachments_data = array();

				for ( $i = 0; $i < $file_count; $i++ ) {
					$file_name = sanitize_file_name( $uploadedfiles['name'][ $i ] );
					$file_type = $uploadedfiles['type'][ $i ];
					$file_tmp_name = $uploadedfiles['tmp_name'][ $i ];
					$file_error = $uploadedfiles['error'][ $i ];
					$file_size = $uploadedfiles['size'][ $i ];

					if ( $file_error !== UPLOAD_ERR_OK ) {
						$errors[] = 'Error uploading file: ' . $file_name;
						continue;
					}

					$max_file_size = 10 * 1024 * 1024; // 10 MB
					if ( $file_size > $max_file_size ) {
						$errors[] = 'File size exceeds limit for file: ' . $file_name;
						continue;
					}

					$file_data = array(
						'file' => new \CURLFile( $file_tmp_name, $file_type, $file_name ),
						'key' => $api_key,
						'token' => $api_token,
					);

					$attachment_url = "https://api.trello.com/1/cards/{$card_id}/attachments";
					$ch = curl_init();
					curl_setopt( $ch, CURLOPT_URL, $attachment_url );
					curl_setopt( $ch, CURLOPT_POST, 1 );
					curl_setopt( $ch, CURLOPT_POSTFIELDS, $file_data );
					curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

					$attachment_response = curl_exec( $ch );
					$attachment_error = curl_error( $ch );
					curl_close( $ch );

					if ( $attachment_error ) {
						$errors[] = 'Error uploading attachment for file ' . $file_name . ': ' . $attachment_error;
						continue;
					}

					$attachment_body = json_decode( $attachment_response, true );

					if ( isset( $attachment_body['id'] ) ) {
						++$success_count;
						$attachments_data[] = array(
							'id' => $attachment_body['id'],
							'name' => isset( $attachment_body['name'] ) ? $attachment_body['name'] : $file_name,
							'url' => isset( $attachment_body['url'] ) ? $attachment_body['url'] : '',
							'bytes' => isset( $attachment_body['bytes'] ) ? $attachment_body['bytes'] : 0,
						);
					} else {
						$errors[] = 'File "' . $file_name . '" uploaded but attachment info not retrieved.';
					}
				}

				if ( ! empty( $attachments_data ) && ! is_wp_error( $post_id ) && $post_id ) {
					update_post_meta( $post_id, 'trello_card_attachments', $attachments_data );
				}

				if ( $success_count > 0 && empty( $errors ) ) {
					$response_message = 'Card created and all files attached successfully!';
				} elseif ( $success_count > 0 && ! empty( $errors ) ) {
					$error_messages = implode( '<br>', $errors );
					$response_message = "Card created. Successfully attached $success_count files.<br>Errors:<br>$error_messages";
				} else {
					$error_messages = implode( '<br>', $errors );
					wp_send_json_error( "Card created but failed to attach files.<br>Errors:<br>$error_messages" );
				}
			} else {
				$response_message = 'Card created successfully!';
			}

			$trello_backend = \ASTRALAB\Trello_Backend::get_instance();

			if ( $trello_backend ) {

				// Register webhook for this card, using the card name
				$webhook_result = $trello_backend->register_trello_webhook( $card_id, "Monitoring {$card_name}" );
				if ( is_wp_error( $webhook_result ) ) {
					error_log( 'Error creating Trello webhook: ' . $webhook_result->get_error_message() );
				} elseif ( isset( $webhook_result['id'] ) && ! is_wp_error( $post_id ) && $post_id ) {
					update_post_meta( $post_id, 'trello_webhook_id', $webhook_result['id'] );
				}
			}

			wp_send_json_success( $response_message );

		} else {
			wp_send_json_error( 'Error creating card.' );
		}

		wp_die();
	}
}