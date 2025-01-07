<?php

namespace ASTRALAB;

use League\HTMLToMarkdown\HtmlConverter;

class Trello_Backend {
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

		// Create Trello Board from user profile
		add_action( 'edit_user_profile', array( $this, 'add_create_trello_board_checkbox' ) );
		add_action( 'show_user_profile', array( $this, 'add_create_trello_board_checkbox' ) );
		add_action( 'personal_options_update', array( $this, 'astralab_handle_create_trello_board_on_profile_save' ) );
		add_action( 'edit_user_profile_update', array( $this, 'astralab_handle_create_trello_board_on_profile_save' ) );
		add_action( 'user_register', array( $this, 'astralab_handle_create_trello_board_on_profile_save' ) );

		add_action( 'admin_notices', array( $this, 'astralab_show_trello_board_message_checkbox' ) );

		// AJAX: handle trello card creation
		add_action( 'wp_ajax_astralab_form_submission', array( $this, 'astralab_form_submission' ) );
		//add_action( 'wp_ajax_nopriv_astralab_form_submission', array( $this, 'astralab_form_submission' ) );


		//Add Rest API for Options
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
	}

	/**
	 * Register REST API routes
	 */
	public function register_rest_routes() {
		register_rest_route( 'astralab/v1', '/options', array(
			'methods' => 'GET',
			'callback' => function () {
				return get_fields( 'options' );
			},
			'permission_callback' => '__return_true',
		) );

		register_rest_field(
			'product-type',
			'featured_media_url',
			array(
				'get_callback' => function ($object) {
					$media_id = $object['featured_media'];
					if ( $media_id ) {
						return wp_get_attachment_url( $media_id );
					}
					return null;
				},
				'update_callback' => null, // Optional: If you want to make it writable
				'schema' => array(
					'description' => 'The URL of the featured media.',
					'type' => 'string',
					'context' => array( 'view' ),
				),
			)
		);

		register_rest_field(
			'product-type',
			'component_field',
			array(
				'get_callback' => function ($object) {
					$post_id = $object['id'];
					if ( $post_id ) {
						return get_field( 'component', $post_id );
					}
					return null;
				},
				'update_callback' => null, // Optional: If you want to make it writable
				'schema' => array(
					'description' => 'Component field.',
					'type' => 'string',
					'context' => array( 'view' ),
				),
			)
		);

		register_rest_field(
			'product-type',
			'design_inspiration',
			array(
				'get_callback' => function ($object) {
					$post_id = $object['id'];
					if ( $post_id ) {
						return get_field( 'design_inspiration', $post_id );
					}
					return null;
				},
				'update_callback' => null, // Optional: If you want to make it writable
				'schema' => array(
					'description' => 'Design Inspiration.',
					'type' => 'string',
					'context' => array( 'view' ),
				),
			)
		);

		register_rest_field(
			'product-type',
			'product_types_options',
			array(
				'get_callback' => function ($object) {
					$post_id = $object['id'];
					if ( $post_id ) {
						return get_field( 'product_types_options', $post_id );
					}
					return null;
				},
				'update_callback' => null, // Optional: If you want to make it writable
				'schema' => array(
					'description' => 'Type Options.',
					'type' => 'string',
					'context' => array( 'view' ),
				),
			)
		);
	}

	/**
	 * Get Trello API
	 */
	public function trello_api_request( $method, $endpoint, $params = array(), $headers = array() ) {
		$trello_api = \ASTRALAB\Trello_API::get_instance();
		return $trello_api->trello_api_request( $method, $endpoint, $params, $headers );
	}

	/**
	 * Register a Trello webhook
	 *
	 * @param string $id_model Board or Card ID to watch
	 * @param string $description
	 */
	public function register_trello_webhook( $id_model, $description = 'My Trello Webhook' ) {
		$options = get_option( $this->option_name );
		$callback_url = $options['trello_webhook_callback'] ?? '';

		// Validate inputs
		if ( empty( $callback_url ) || empty( $id_model ) ) {
			return new \WP_Error( 'trello_missing_credentials', 'Missing callback URL or id_model.' );
		}

		// Prepare request payload
		$body = array(
			'callbackURL' => $callback_url,
			'idModel' => $id_model,
			'description' => $description,
		);

		// Use trello_api_request for the POST request
		$response = $this->trello_api_request( 'POST', 'webhooks', $body );

		// Handle response or return WP_Error
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		return $response;
	}

	/**
	 * Add a checkbox to user profile to create Trello Board
	 */
	public function add_create_trello_board_checkbox( $user ) {
		if ( ! current_user_can( 'edit_user', $user->ID ) ) {
			return;
		}
		$trello_board_id = get_user_meta( $user->ID, 'trello_board_id', true );
		$trello_url = get_user_meta( $user->ID, 'trello_board_short_url', true );
		$trello_list_id = get_user_meta( $user->ID, 'trello_list_id', true );

		?>
		<h2>Create Trello Board</h2>
		<table class="form-table">
			<tr>
				<th scope="row"><label for="create_trello_board">Trello Board</label></th>
				<?php
				if ( ! empty( $trello_board_id ) ) {
					echo '<td>
					<p><strong>Trello Board ID:</strong> ' . esc_html( $trello_board_id ) . ' <a href="' . esc_url( $trello_url ) . '" target="_blank">View Board</a></p>';
					if ( ! empty( $trello_list_id ) ) {
						echo '<p><strong>List ID:</strong> ' . esc_html( $trello_list_id ) . '</p>';
					}
					echo '</td>';
				} else {
					?>
					<td>
						<label for="create_trello_board">
							<input type="checkbox" name="create_trello_board" id="create_trello_board" value="1">
							Create Trello Board Named '<?php echo esc_html( $user->display_name ); ?> Board'
						</label>
					</td>
					<?php
				}
				?>
			</tr>
		</table>
		<?php
	}

	/**
	 * Handle creating Trello board on profile save
	 */
	public function astralab_handle_create_trello_board_on_profile_save( $user_id ) {
		// Check user permissions
		if ( ! current_user_can( 'edit_user', $user_id ) ) {
			return;
		}

		// Check if the "Create Trello Board" checkbox is checked
		if ( empty( $_POST['create_trello_board'] ) ) {
			return;
		}

		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			return;
		}

		$full_name = $user->display_name ?: 'User';
		$board_name = $full_name . ' Board';

		// Prepare board creation arguments
		$board_args = array(
			'name' => $board_name,
			'defaultLists' => 'true',
			'prefs_permissionLevel' => 'private',
			'idOrganization' => 'astralabtickets',
		);

		// Create the board using trello_api_request
		$board_response = $this->trello_api_request( 'POST', 'boards', $board_args );

		// Handle errors in creating the board
		if ( is_wp_error( $board_response ) ) {
			$this->astralab_redirect_with_message( $user_id, 'error', 'Error creating board: ' . $board_response->get_error_message() );
			return;
		}

		if ( isset( $board_response['id'] ) ) {
			// Save board ID and short URL to user meta
			update_user_meta( $user_id, 'trello_board_id', $board_response['id'] );

			if ( isset( $board_response['shortUrl'] ) ) {
				update_user_meta( $user_id, 'trello_board_short_url', $board_response['shortUrl'] );
			}

			// Retrieve the lists for the created board
			$lists_response = $this->trello_api_request( 'GET', "boards/{$board_response['id']}/lists" );

			if ( ! is_wp_error( $lists_response ) && is_array( $lists_response ) ) {
				foreach ( $lists_response as $list ) {
					if ( isset( $list['name'] ) && $list['name'] === 'To Do' && isset( $list['id'] ) ) {
						update_user_meta( $user_id, 'trello_list_id', $list['id'] );
						break;
					}
				}
			}

			// Redirect with success message
			$this->astralab_redirect_with_message( $user_id, 'success', 'Trello board created successfully!' );

		} else {
			$this->astralab_redirect_with_message( $user_id, 'error', 'Failed to create Trello board. Check API credentials and permissions.' );
		}
	}


	// Helper function to redirect
	public function astralab_redirect_with_message( $user_id, $type = 'error', $message = '' ) {
		$redirect_url = add_query_arg(
			array(
				'user_id' => $user_id,
				'updated' => 'true',
				'type' => $type,
				'message' => urlencode( $message ),
			),
			admin_url( 'user-edit.php' )
		);
		wp_safe_redirect( $redirect_url );
		exit;
	}

	public function astralab_show_trello_board_message_checkbox() {
		if ( isset( $_GET['updated'] ) && $_GET['updated'] === 'true' && isset( $_GET['message'] ) ) {
			$message = urldecode( $_GET['message'] );
			$type = isset( $_GET['type'] ) ? sanitize_text_field( $_GET['type'] ) : 'error';

			$class = ( $type === 'success' ) ? 'notice-success' : 'notice-error';

			echo '<div class="notice ' . esc_attr( $class ) . ' is-dismissible"><p>' . esc_html( $message ) . '</p></div>';
		}
	}

	public function astralab_form_submission() {
		$nonce = $_POST['astralab_nonce'];

		$user_id = get_current_user_id();


		$return['post'] = $_POST;
		$return['file'] = $_FILES['fileUpload'];
		$return['user'] = $user_id;
		$post = $_POST;

		//check astralab_nonce
		if ( ! wp_verify_nonce( $nonce, 'astralab_nonce' ) ) {
			wp_send_json_error(
				array(
					'message' => 'Invalid nonce verification',
					'post' => $_POST
				) );
		}

		$options = get_option( $this->option_name );
		$api_key = isset( $options['trello_api_key'] ) ? $options['trello_api_key'] : '';
		$api_token = isset( $options['trello_api_token'] ) ? $options['trello_api_token'] : '';
		$list_id = get_user_meta( $user_id, 'trello_list_id', true );

		if ( empty( $api_key ) ) {
			wp_send_json_error( 'Trello API credentials not set.' );
		}

		if ( empty( $api_token ) ) {
			wp_send_json_error( 'Trello API Token not set' );
		}

		if ( empty( $list_id ) ) {
			wp_send_json_error( 'Trello List ID not set.' );
		}

		$card_name = sanitize_text_field( $_POST['projectName'] );

		$user = wp_get_current_user();
		if ( $user && $user->ID ) {
			$full_name = $user->display_name;
			$email = $user->user_email;
		} else {
			$full_name = 'Guest';
			$email = 'N/A';
		}

		$jsonData = json_decode( json_encode( $_POST ), true );


		$user_line = '**User:** ' . ( ! empty( $full_name ) ? $full_name : 'N/A' );
		$email_line = '**Email:** ' . ( ! empty( $email ) ? $email : 'N/A' );

		$project_details = '<p><strong>Project Name:</strong> ' . $card_name . '</p>';
		$project_details .= '<p><strong>Turnaround Time:</strong> ' . $_POST['turnaroundTime'] . '</p>';
		$project_details .= '<p><strong>Design Details:</strong> ' . $_POST['designDetails'] . '</p>';
		$project_details .= '<p><strong>Project Description:</strong>' . '</p>';
		$project_details .= '<p>' . sanitize_textarea_field( $_POST['projectDescription'] ) . '</p>';

		$project_details .= '<p><strong>Layout Type:</strong> ' . $_POST['layoutType'] . '</p>';

		$project_details .= '<p><strong>Product Types:</strong>' . '</p>';

		$ada = $jsonData['ADA'];
		if ( ! empty( $_POST["hasADA"] ) && $ada ) {
			$signs = $ada['signs'] ?? [];
			$ada_types = $ada['types'] ?? [];
			$ada_design = $ada['designInspirations'] ?? [];
			$project_details .= '<h3><strong>ADA Wayfinding:</strong></h3>';
			$project_details .= '<ul><li><strong>No. of Signs:</strong> ' . $ada['numberOfSigns'];
			foreach ( $signs as $index => $sign ) {
				$no = $index + 1;
				$project_details .= '<ul>';
				$project_details .= "<li>No.$no Name: {$sign['name']}</li>";
				$project_details .= "<li>No.$no Dimension: {$sign['dimension']}</li>";
				$project_details .= "<li>No.$no Details: {$sign['details']}</li>";
				$project_details .= '</ul>';
			}
			$project_details .= '</li>';
			$project_details .= '<li><strong>Types:</strong> ' . implode( ", ", $ada_types ) . '</li>';
			$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $ada_design ) . '</li>';
			$project_details .= '</ul>';
		}

		$monuments = $jsonData['monumentsAndPylons'];

		if ( ! empty( $_POST["hasMonumentsAndPylons"] ) && $monuments ) {
			$monuments_types = $monuments['types'] ?? [];
			$monuments_design = $monuments['designInspirations'] ?? [];
			$project_details .= '<h3><strong>Monuments & Pylons</strong></h3>';
			$project_details .= '<ul><li><strong>No. of Signs:</strong> ' . $monuments['numberOfSigns'];
			$project_details .= '<ul>';
			$project_details .= "<li>Text & Content: {$monuments['textAndContent']}</li>";
			$project_details .= "<li>Vendor: {$monuments['vendor']}</li>";
			$project_details .= "<li>Sides: {$monuments['sides']}</li>";
			$project_details .= "<li>Dimensions: {$monuments['dimensions']}</li>";
			$project_details .= "<li>Maximum Content Area: {$monuments['maxContentArea']}</li>";
			$project_details .= "<li>Minimum Content Area: {$monuments['minContentArea']}</li>";
			$project_details .= "<li>Maximum Ground Clearance: {$monuments['maxGroundClearance']}</li>";
			$project_details .= '</ul>';
			$project_details .= '</li>';
			$project_details .= '<li><strong>Types:</strong> ' . implode( ", ", $monuments_types ) . '</li>';
			$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $monuments_design ) . '</li>';
			$project_details .= '</ul>';

		}

		$converter = new HtmlConverter();
		$markdown = $converter->convert( $project_details );


		$md_desc = $user_line . "\n" . $email_line . "\n\n" . $markdown;

		// Create the Trello card
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

			// Create a trello_card post and set the author to the current user
			$post_author = get_current_user_id();
			$post_id = wp_insert_post(
				array(
					'post_type' => 'trello-card',
					'post_title' => $card_name,
					'post_status' => 'publish',
					'post_author' => $post_author,
				)
			);

			if ( ! is_wp_error( $post_id ) && $post_id ) {
				update_post_meta( $post_id, 'trello_card_id', $card_id );
				update_post_meta( $post_id, 'trello_card_message', $project_details );
				update_post_meta( $post_id, 'trello_card_user_name', $full_name );
				update_post_meta( $post_id, 'trello_card_user_email', $email );
			}

			// Handle multiple file uploads
			if ( ! empty( $_FILES['fileUpload']['name'][0] ) ) {
				$uploadedfiles = $_FILES['fileUpload'];
				$file_count = count( $uploadedfiles['name'] );
				$errors = array();
				$success_count = 0;

				for ( $i = 0; $i < $file_count; $i++ ) {
					$file_name = sanitize_file_name( $uploadedfiles['name'][ $i ] );
					$file_type = $uploadedfiles['type'][ $i ];
					$file_tmp_name = $uploadedfiles['tmp_name'][ $i ];
					$file_error = $uploadedfiles['error'][ $i ];
					$file_size = $uploadedfiles['size'][ $i ];

					// Check for upload errors
					if ( $file_error !== UPLOAD_ERR_OK ) {
						$errors[] = 'Error uploading file: ' . $file_name;
						continue;
					}

					// Validate file size if needed
					$max_file_size = 10 * 1024 * 1024; // 10 MB
					if ( $file_size > $max_file_size ) {
						$errors[] = 'File size exceeds limit for file: ' . $file_name;
						continue;
					}

					// Prepare the file for upload to Trello
					$file_data = array(
						'file' => new \CURLFile( $file_tmp_name, $file_type, $file_name ),
						'key' => $api_key,
						'token' => $api_token,
					);

					// Attach the file to the Trello card
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

					$attachment_data = json_decode( $attachment_response, true );


					if ( $attachment_data && isset( $attachment_data['id'] ) ) {
						$attachment_info = array(
							'trello_id' => $attachment_data['id'],
							'name' => $file_name,
							'url' => $attachment_data['url'] ?? '',
							'date' => current_time( 'mysql' )
						);

						// Get existing attachments or initialize empty array
						$existing_attachments = get_post_meta( $post_id, 'trello_card_attachments', true );
						if ( ! is_array( $existing_attachments ) ) {
							$existing_attachments = array();
						}

						// Add new attachment
						$existing_attachments[] = $attachment_info;

						// Update post meta with all attachments
						update_post_meta( $post_id, 'trello_card_attachments', $existing_attachments );
					}

					++$success_count;
				}


				$webhook_result = $this->register_trello_webhook( $card_id, "Monitoring {$card_name}" );
				if ( is_wp_error( $webhook_result ) ) {
					error_log( 'Error creating Trello webhook: ' . $webhook_result->get_error_message() );
				} elseif ( isset( $webhook_result['id'] ) && ! is_wp_error( $post_id ) && $post_id ) {
					update_post_meta( $post_id, 'trello_webhook_id', $webhook_result['id'] );
				}

				// Generate response message
				if ( $success_count > 0 && empty( $errors ) ) {

					wp_send_json_success( array(
						'message' => 'Card created and all files attached successfully!',
					) );
				} elseif ( $success_count > 0 && ! empty( $errors ) ) {
					$error_messages = implode( '<br>', $errors );
					wp_send_json_success( "Card created. Successfully attached $success_count files.<br>Errors:<br>$error_messages" );
				} else {
					$error_messages = implode( '<br>', $errors );
					wp_send_json_error( "Card created but failed to attach files.<br>Errors:<br>$error_messages" );
				}
			} else {
				wp_send_json_success( 'Card created successfully!' );
			}
		} else {
			wp_send_json_error( 'Error creating card.' );
		}

		wp_die();

	}
}