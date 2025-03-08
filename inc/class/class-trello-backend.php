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
			'methods' => \WP_REST_Server::READABLE,
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
						return get_field( 'design_inspiration_group', $post_id );
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

	public function array_to_string( $value ) {
		if ( is_array( $value ) ) {
			return implode( ', ', $value );
		}
		return $value;
	}

	public function astralab_form_submission() {
		try {
			// Verify nonce first
			if ( ! isset( $_POST['astralab_nonce'] ) || ! wp_verify_nonce( $_POST['astralab_nonce'], 'astralab_nonce' ) ) {
				throw new \Exception( 'Invalid security token' );
			}

			// Log incoming request data
			error_log( 'Incoming Form Data: ' . print_r( $_POST, true ) );
			error_log( 'Incoming Files: ' . print_r( $_FILES, true ) );

			// Check if files were uploaded
			if ( ! empty( $_FILES ) ) {
				foreach ( $_FILES as $key => $file ) {
					if ( is_array( $file['error'] ) ) {
						foreach ( $file['error'] as $index => $error ) {
							if ( $error !== UPLOAD_ERR_OK ) {
								error_log( "File upload error for {$key}[{$index}]: " . $this->get_file_error_message( $error ) );
							}
						}
					} else if ( $file['error'] !== UPLOAD_ERR_OK ) {
						error_log( "File upload error for {$key}: " . $this->get_file_error_message( $file['error'] ) );
					}
				}
			}

			$return['post'] = $_POST;
			$return['file'] = $_FILES['fileUpload'];
			$return['bulkFile'] = $_FILES['bulkOrderFile']['name'];
			$return['user'] = get_current_user_id();
			$post = $_POST;

			$options = get_option( $this->option_name );
			$api_key = isset( $options['trello_api_key'] ) ? $options['trello_api_key'] : '';
			$api_token = isset( $options['trello_api_token'] ) ? $options['trello_api_token'] : '';
			$list_id = get_user_meta( get_current_user_id(), 'trello_list_id', true );

			if ( empty( $api_key ) ) {
				throw new \Exception( 'Trello API credentials not set.' );
			}

			if ( empty( $api_token ) ) {
				throw new \Exception( 'Trello API Token not set' );
			}

			if ( empty( $list_id ) ) {
				throw new \Exception( 'Trello List ID not set.' );
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

			$turn_around_time = $_POST['turnaroundTime'] ? $_POST['turnaroundTime'] : '';
			$design_details = $_POST['designDetails'] ? $_POST['designDetails'] : '';
			$description = $_POST['projectDescription'] ? $_POST['projectDescription'] : '';
			$layout_type = $_POST['layoutType'] ? $_POST['layoutType'] : '';

			// Build your project details as before...
			$project_details = '<p><strong>Project Name:</strong> ' . $card_name . '</p>';
			$project_details .= '<p><strong>Turnaround Time:</strong> ' . $turn_around_time . '</p>';
			$project_details .= '<p><strong>Design Details:</strong> ' . $design_details . '</p>';
			$project_details .= '<p><strong>Project Description:</strong></p>';
			$project_details .= '<p>' . sanitize_textarea_field( $description ) . '</p>';
			$project_details .= '<p><strong>Layout Type:</strong> ' . $layout_type . '</p>';
			$project_details .= '<p><strong>Product Types:</strong></p>';

			// --- ADA ---
			$ada = $jsonData['ADA'] ?? [];
			if ( ! empty( $_POST["hasADA"] ) && ! empty( $ada ) ) {
				$signs = json_decode( stripslashes( $ada['signs'] ), true ) ?? [];  // Decode the JSON string
				$ada_types = $this->array_to_string( $ada['types'] );
				$ada_design = [];

				if ( ! empty( $ada['designInspirations'] ) ) {
					$ada_inspirations_json = $ada['designInspirations'];
					$ada_inspirations = json_decode( stripslashes( $ada_inspirations_json ), true );
					if ( is_array( $ada_inspirations ) ) {
						foreach ( $ada_inspirations as $ada_inspiration ) {
							if ( isset( $ada_inspiration['url'] ) && isset( $ada_inspiration['title'] ) ) {
								$ada_design[] = '<a href="' . esc_url( $ada_inspiration['url'] ) . '">' . esc_html( $ada_inspiration['title'] ) . '</a>';
							}
						}
					}
				}

				$project_details .= '<h3><strong>ADA Wayfinding:</strong></h3>';
				$project_details .= '<ul><li><strong>No. of Signs:</strong> ' . ( $ada['numberOfSigns'] ?? '' );


				foreach ( $signs as $index => $sign ) {
					$no = $index + 1;
					$project_details .= '<ul>';
					$project_details .= "<li>No.$no Name: " . ( $sign['name'] ?? '' ) . "</li>";
					$project_details .= "<li>No.$no Dimension: " . ( $sign['dimension'] ?? '' ) . "</li>";
					$project_details .= "<li>No.$no Details: " . ( $sign['details'] ?? '' ) . "</li>";
					$project_details .= '</ul>';
				}
				$project_details .= '</li>';
				$project_details .= '<li><strong>Types:</strong> ' . $ada_types . '</li>';
				$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $ada_design ) . '</li>';
				$project_details .= '</ul>';
			}

			// --- Monuments & Pylons ---
			$monuments = $jsonData['monumentsAndPylons'] ?? [];
			if ( ! empty( $_POST["hasMonumentsAndPylons"] ) && ! empty( $monuments ) ) {
				$monuments_types = $this->array_to_string( $monuments['types'] );

				$monuments_design = [];

				if ( ! empty( $monuments['designInspirations'] ) ) {
					$monuments_inspirations_json = $monuments['designInspirations'];
					$monuments_inspirations = json_decode( stripslashes( $monuments_inspirations_json ), true );
					if ( is_array( $monuments_inspirations ) ) {
						foreach ( $monuments_inspirations as $monuments_inspiration ) {
							if ( isset( $monuments_inspiration['url'] ) && isset( $monuments_inspiration['title'] ) ) {
								$monuments_design[] = '<a href="' . esc_url( $monuments_inspiration['url'] ) . '">' . esc_html( $monuments_inspiration['title'] ) . '</a>';
							}
						}
					}
				}

				$illumination = $this->array_to_string( $monuments['illumination'] );
				$project_details .= '<h3><strong>Monuments & Pylons</strong></h3>';
				$project_details .= '<ul><li><strong>No. of Signs:</strong> ' . ( $monuments['numberOfSigns'] ?? '' );
				$project_details .= '<ul>';
				$project_details .= "<li>Text & Content: " . ( $monuments['textAndContent'] ?? '' ) . "</li>";
				$project_details .= "<li>Vendor: " . ( $monuments['vendor'] ?? '' ) . "</li>";
				$project_details .= "<li>Sides: " . ( $monuments['sides'] ?? '' ) . "</li>";
				$project_details .= "<li>Dimensions: " . ( $monuments['dimensions'] ?? '' ) . "</li>";
				$project_details .= "<li>Maximum Content Area: " . ( $monuments['maxContentArea'] ?? '' ) . "</li>";
				$project_details .= "<li>Minimum Content Area: " . ( $monuments['minContentArea'] ?? '' ) . "</li>";
				$project_details .= "<li>Maximum Ground Clearance: " . ( $monuments['maxGroundClearance'] ?? '' ) . "</li>";
				$project_details .= '</ul>';
				$project_details .= '</li>';
				$project_details .= '<li><strong>Types:</strong> ' . $monuments_types . '</li>';
				$project_details .= '<li><strong>Illumination:</strong> ' . $illumination . '</li>';
				$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $monuments_design ) . '</li>';
				$project_details .= '</ul>';
			}

			// --- Channel Letters ---
			$channelLetters = $jsonData['channelLetters'] ?? [];
			if ( ! empty( $_POST["channelLetters"] ) && ! empty( $channelLetters ) ) {
				$channelLetters_types = $this->array_to_string( $channelLetters['types'] );
				$channelLetters_backer = $this->array_to_string( $channelLetters['backer'] );
				$channelLetters_mounting = $this->array_to_string( $channelLetters['mounting'] );
				$channelLetters_design = [];

				if ( ! empty( $channelLetters['designInspirations'] ) ) {
					$channelLetters_inspirations_json = $channelLetters['designInspirations'];
					$channelLetters_inspirations = json_decode( stripslashes( $channelLetters_inspirations_json ), true );
					if ( is_array( $channelLetters_inspirations ) ) {
						foreach ( $channelLetters_inspirations as $channelLetters_inspiration ) {
							if ( isset( $channelLetters_inspiration['url'] ) && isset( $channelLetters_inspiration['title'] ) ) {
								$channelLetters_design[] = '<a href="' . esc_url( $channelLetters_inspiration['url'] ) . '">' . esc_html( $channelLetters_inspiration['title'] ) . '</a>';
							}
						}
					}
				}



				$project_details .= '<h3><strong>Channel Letters</strong></h3>';
				$project_details .= '<ul><li><strong>No. of Signs:</strong> ' . ( $channelLetters['numberOfSigns'] ?? '' );
				$project_details .= '<ul>';
				if ( ! empty( $channelLetters['textAndContent'] ) ) {
					$project_details .= "<li>Text & Content: " . ( $channelLetters['textAndContent'] ?? '' ) . "</li>";
				}
				if ( ! empty( $channelLetters['vendor'] ) ) {
					$project_details .= "<li>Vendor: " . ( $channelLetters['vendor'] ?? '' ) . "</li>";
				}
				if ( ! empty( $channelLetters['sides'] ) ) {
					$project_details .= "<li>Sides: " . ( $channelLetters['sides'] ?? '' ) . "</li>";
				}
				if ( ! empty( $channelLetters['dimensions'] ) ) {
					$project_details .= "<li>Dimensions: " . ( $channelLetters['dimensions'] ?? '' ) . "</li>";
				}
				if ( ! empty( $channelLetters['maxContentArea'] ) ) {
					$project_details .= "<li>Maximum Content Area: " . ( $channelLetters['maxContentArea'] ?? '' ) . "</li>";
				}
				if ( ! empty( $channelLetters['minContentArea'] ) ) {
					$project_details .= "<li>Minimum Content Area: " . ( $channelLetters['minContentArea'] ?? '' ) . "</li>";
				}
				if ( ! empty( $channelLetters['maxGroundClearance'] ) ) {
					$project_details .= "<li>Maximum Ground Clearance: " . ( $channelLetters['maxGroundClearance'] ?? '' ) . "</li>";
				}
				$project_details .= '</ul>';
				$project_details .= '</li>';
				if ( ! empty( $channelLetters_types ) ) {
					$project_details .= '<li><strong>Types:</strong> ' . $channelLetters_types . '</li>';
				}
				if ( ! empty( $channelLetters_backer ) ) {
					$project_details .= '<li><strong>Backer:</strong> ' . $channelLetters_backer . '</li>';
				}
				if ( ! empty( $channelLetters_mounting ) ) {
					$project_details .= '<li><strong>Mounting:</strong> ' . $channelLetters_mounting . '</li>';
				}
				if ( ! empty( $channelLetters_design ) ) {
					$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $channelLetters_design ) . '</li>';
				}
				$project_details .= '</ul>';
			}

			// --- Dimensional Letters ---
			$dimensionalLetters = $jsonData['dimensionalLetters'] ?? [];
			if ( ! empty( $_POST["dimensionalLetters"] ) && ! empty( $dimensionalLetters ) ) {
				$dimensionalLetters_types = $this->array_to_string( $dimensionalLetters['types'] );
				$dimensionalLetters_mounting = $this->array_to_string( $dimensionalLetters['mounting'] );
				$dimensionalLetters_design = [];

				if ( ! empty( $dimensionalLetters['designInspirations'] ) ) {
					$dimensionalLetters_inspirations_json = $dimensionalLetters['designInspirations'];
					$dimensionalLetters_inspirations = json_decode( stripslashes( $dimensionalLetters_inspirations_json ), true );
					if ( is_array( $dimensionalLetters_inspirations ) ) {
						foreach ( $dimensionalLetters_inspirations as $dimensionalLetters_inspiration ) {
							if ( isset( $dimensionalLetters_inspiration['url'] ) && isset( $dimensionalLetters_inspiration['title'] ) ) {
								$dimensionalLetters_design[] = '<a href="' . esc_url( $dimensionalLetters_inspiration['url'] ) . '">' . esc_html( $dimensionalLetters_inspiration['title'] ) . '</a>';
							}
						}
					}
				}

				$project_details .= '<h3><strong>Dimensional Letters</strong></h3>';
				$project_details .= '<ul><li><strong>No. of Signs:</strong> ' . ( $dimensionalLetters['numberOfSigns'] ?? '' );
				$project_details .= '<ul>';
				if ( ! empty( $dimensionalLetters['textAndContent'] ) ) {
					$project_details .= "<li>Text & Content: " . ( $dimensionalLetters['textAndContent'] ?? '' ) . "</li>";
				}
				if ( ! empty( $dimensionalLetters['font'] ) ) {
					$project_details .= "<li>Font: " . ( $dimensionalLetters['font'] ?? '' ) . "</li>";
				}
				if ( ! empty( $dimensionalLetters['vendor'] ) ) {
					$project_details .= "<li>Vendor: " . ( $dimensionalLetters['vendor'] ?? '' ) . "</li>";
				}
				if ( ! empty( $dimensionalLetters['wallDimension'] ) ) {
					$project_details .= "<li>Wall Dimension: " . ( $dimensionalLetters['wallDimension'] ?? '' ) . "</li>";
				}
				if ( ! empty( $dimensionalLetters['signDimension'] ) ) {
					$project_details .= "<li>Sign Dimension: " . ( $dimensionalLetters['signDimension'] ?? '' ) . "</li>";
				}
				if ( ! empty( $dimensionalLetters['sides'] ) ) {
					$project_details .= "<li>Sides: " . ( $dimensionalLetters['sides'] ?? '' ) . "</li>";
				}
				if ( ! empty( $dimensionalLetters['backPanel'] ) ) {
					$project_details .= "<li>Back Panel: " . ( $dimensionalLetters['backPanel'] ?? '' ) . "</li>";
				}
				if ( ! empty( $dimensionalLetters['location'] ) ) {
					$project_details .= "<li>Location: " . ( $dimensionalLetters['location'] ?? '' ) . "</li>";
				}
				$project_details .= '</ul>';
				$project_details .= '</li>';
				if ( ! empty( $dimensionalLetters_types ) ) {
					$project_details .= '<li><strong>Types:</strong> ' . $dimensionalLetters_types . '</li>';
				}
				if ( ! empty( $dimensionalLetters_mounting ) ) {
					$project_details .= '<li><strong>Mounting:</strong> ' . $dimensionalLetters_mounting . '</li>';
				}
				if ( ! empty( $dimensionalLetters_design ) ) {
					$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $dimensionalLetters_design ) . '</li>';
				}
				$project_details .= '</ul>';
			}

			// --- Lightbox ---
			$lightbox = $jsonData['lightbox'] ?? [];
			if ( ! empty( $_POST["lightbox"] ) && ! empty( $lightbox ) ) {
				$lightbox_types = $this->array_to_string( $lightbox['types'] );
				$lightbox_mounting = $this->array_to_string( $lightbox['mounting'] );
				$lightbox_design = [];

				if ( ! empty( $lightbox['designInspirations'] ) ) {
					$lightbox_inspirations_json = $lightbox['designInspirations'];
					$lightbox_inspirations = json_decode( stripslashes( $lightbox_inspirations_json ), true );
					if ( is_array( $lightbox_inspirations ) ) {
						foreach ( $lightbox_inspirations as $lightbox_inspiration ) {
							if ( isset( $lightbox_inspiration['url'] ) && isset( $lightbox_inspiration['title'] ) ) {
								$lightbox_design[] = '<a href="' . esc_url( $lightbox_inspiration['url'] ) . '">' . esc_html( $lightbox_inspiration['title'] ) . '</a>';
							}
						}
					}
				}


				$project_details .= '<h3><strong>Lightbox</strong></h3>';
				$project_details .= '<ul><li><strong>No. of Signs:</strong> ' . ( $lightbox['numberOfSigns'] ?? '' );
				$project_details .= '<ul>';
				$project_details .= "<li>Text & Content: " . ( $lightbox['textAndContent'] ?? '' ) . "</li>";
				$project_details .= "<li>Font: " . ( $lightbox['font'] ?? '' ) . "</li>";
				$project_details .= "<li>Wall Dimension: " . ( $lightbox['wallDimension'] ?? '' ) . "</li>";
				$project_details .= "<li>Sign Dimension: " . ( $lightbox['signDimension'] ?? '' ) . "</li>";
				$project_details .= "<li>Depth: " . ( $lightbox['depth'] ?? '' ) . "</li>";
				$project_details .= "<li>Sides: " . ( $lightbox['sides'] ?? '' ) . "</li>";
				$project_details .= "<li>Color: " . ( $lightbox['color'] ?? '' ) . "</li>";
				$project_details .= "<li>Retainers: " . ( $lightbox['retainers'] ?? '' ) . "</li>";
				$project_details .= '</ul>';
				$project_details .= '</li>';
				$project_details .= '<li><strong>Types:</strong> ' . $lightbox_types . '</li>';
				$project_details .= '<li><strong>Mounting:</strong> ' . $lightbox_mounting . '</li>';
				$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $lightbox_design ) . '</li>';
				$project_details .= '</ul>';
			}

			// --- Vehicle Wrap ---
			$vehicleWrap = $jsonData['vehicleWrap'] ?? [];
			if ( ! empty( $_POST["vehicleWrap"] ) && ! empty( $vehicleWrap ) ) {
				$vehicleWrap_design = [];
				if ( ! empty( $vehicleWrap['designInspirations'] ) ) {
					$vehicleWrap_design = array();
					$inspirations_json = $vehicleWrap['designInspirations'];
					$inspirations = json_decode( stripslashes( $inspirations_json ), true );
					if ( is_array( $inspirations ) ) {
						foreach ( $inspirations as $inspiration ) {
							if ( isset( $inspiration['url'] ) && isset( $inspiration['title'] ) ) {
								$vehicleWrap_design[] = '<a href="' . esc_url( $inspiration['url'] ) . '">' . esc_html( $inspiration['title'] ) . '</a>';
							}
						}
					}
				}

				$project_details .= '<h3><strong>Vehicle Wrap</strong></h3>';
				$project_details .= '<ul><li><strong>Description:</strong></li><li>' . ( $vehicleWrap['description'] ?? '' ) . '</li>';
				$project_details .= '<li><strong>Coverage:</strong> ' . ( $vehicleWrap['coverage'] ?? '' ) . '</li>';
				$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $vehicleWrap_design ) . '</li>';
				$project_details .= '</ul>';
			}

			// --- Wall Vinyl ---
			$wallVinyl = $jsonData['wallVinyl'] ?? [];
			if ( ! empty( $_POST["wallVinyl"] ) && ! empty( $wallVinyl ) ) {
				$wallVinyl_design = [];
				if ( ! empty( $wallVinyl['designInspirations'] ) ) {
					$inspirations_json = $wallVinyl['designInspirations'];
					$inspirations = json_decode( stripslashes( $inspirations_json ), true );
					if ( is_array( $inspirations ) ) {
						foreach ( $inspirations as $inspiration ) {
							if ( isset( $inspiration['url'] ) && isset( $inspiration['title'] ) ) {
								$wallVinyl_design[] = '<a href="' . esc_url( $inspiration['url'] ) . '">' . esc_html( $inspiration['title'] ) . '</a>';
							}
						}
					}
				}

				$project_details .= '<h3><strong>Wall Vinyl</strong></h3>';
				$project_details .= '<ul><li><strong>Description:</strong><ul><li>' . ( $wallVinyl['description'] ?? '' ) . '</li></ul></li>';
				$project_details .= '<li><strong>Type:</strong> ' . ( $wallVinyl['type'] ?? '' ) . '</li>';
				$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $wallVinyl_design ) . '</li>';
				$project_details .= '</ul>';
			}

			// --- Print Cut ---
			$printCut = $jsonData['printCut'] ?? [];
			if ( ! empty( $_POST["printCut"] ) && ! empty( $printCut ) ) {
				$printCut_design = [];
				if ( ! empty( $printCut['designInspirations'] ) ) {
					$inspirations_json = $printCut['designInspirations'];
					$inspirations = json_decode( stripslashes( $inspirations_json ), true );
					if ( is_array( $inspirations ) ) {
						foreach ( $inspirations as $inspiration ) {
							if ( isset( $inspiration['url'] ) && isset( $inspiration['title'] ) ) {
								$printCut_design[] = '<a href="' . esc_url( $inspiration['url'] ) . '">' . esc_html( $inspiration['title'] ) . '</a>';
							}
						}
					}
				}

				$project_details .= '<h3><strong>Print Cut</strong></h3>';
				$project_details .= '<ul><li><strong>Description:</strong><ul><li>' . ( $printCut['description'] ?? '' ) . '</li></ul></li>';
				$project_details .= '<li><strong>Type:</strong> ' . ( $printCut['type'] ?? '' ) . '</li>';
				$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $printCut_design ) . '</li>';
				$project_details .= '</ul>';
			}

			// --- Logo Design ---
			$logoDesign = $jsonData['logoDesign'] ?? [];
			if ( ! empty( $_POST["logoDesign"] ) && ! empty( $logoDesign ) ) {
				$logoDesign_design = [];
				if ( ! empty( $logoDesign['designInspirations'] ) ) {
					$inspirations_json = $logoDesign['designInspirations'];
					$inspirations = json_decode( stripslashes( $inspirations_json ), true );
					if ( is_array( $inspirations ) ) {
						foreach ( $inspirations as $inspiration ) {
							if ( isset( $inspiration['url'] ) && isset( $inspiration['title'] ) ) {
								$logoDesign_design[] = '<a href="' . esc_url( $inspiration['url'] ) . '">' . esc_html( $inspiration['title'] ) . '</a>';
							}
						}
					}
				}

				$project_details .= '<h3><strong>Logo Design</strong></h3>';
				$project_details .= '<ul><li><strong>Description:</strong><ul><li>' . ( $logoDesign['description'] ?? '' ) . '</li></ul></li>';
				if ( ! empty( $logoDesign_design ) ) {
					$project_details .= '<li><strong>Design Inspiration:</strong> ' . implode( ", ", $logoDesign_design ) . '</li>';
				}
				$project_details .= '</ul>';
			}

			// --- Custom Job ---
			$customJob = $jsonData['customJob'] ?? [];
			if ( ! empty( $_POST["customJob"] ) && ! empty( $customJob ) ) {
				$customJob_design = [];
				if ( ! empty( $customJob['designInspirations'] ) ) {
					$customJob_design = array();
					$inspirations_json = $customJob['designInspirations'];
					$inspirations = json_decode( stripslashes( $inspirations_json ), true );
					if ( is_array( $inspirations ) ) {
						foreach ( $inspirations as $inspiration ) {
							if ( isset( $inspiration['url'] ) && isset( $inspiration['title'] ) ) {
								$customJob_design[] = '<a href="' . esc_url( $inspiration['url'] ) . '">' . esc_html( $inspiration['title'] ) . '</a>';
							}
						}
					}
				}

				$project_details .= '<h3><strong>Custom Job</strong></h3>';
				$project_details .= '<p><strong>Description:</strong></p><p>' . ( $customJob['description'] ?? '' ) . '</p>';
				$project_details .= '<p><strong>Design Inspiration:</strong> ' . implode( ", ", $customJob_design ) . '</p>';
			}

			$converter = new HtmlConverter();
			$markdown = $converter->convert( $project_details );

			// Combine user_line, email_line, and the converted HTML details
			$md_desc = $user_line . "\n" . $email_line . "\n\n" . $markdown;

			// --- Create the Trello card ---
			$card_url = 'https://api.trello.com/1/cards';
			$card_args = array(
				'key' => $api_key,
				'token' => $api_token,
				'idList' => $list_id,
				'name' => $card_name,
				'desc' => $md_desc, // initial description
			);
			$card_response = wp_remote_post(
				$card_url,
				array(
					'body' => $card_args,
				)
			);

			if ( is_wp_error( $card_response ) ) {
				throw new \Exception( 'Error creating card: ' . $card_response->get_error_message() );
			}

			$card_body = json_decode( wp_remote_retrieve_body( $card_response ) );

			if ( isset( $card_body->id ) ) {
				$card_id = $card_body->id;

				// Get list name directly from the card response if available
				$list_name = isset( $card_body->list->name ) ? $card_body->list->name : '';

				// Fallback to API call only if list name isn't in card response
				if ( empty( $list_name ) ) {
					$list_response = $this->trello_api_request( 'GET', "lists/{$list_id}" );
					$list_name = ! is_wp_error( $list_response ) && isset( $list_response['name'] ) ? $list_response['name'] : '';
				}

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

					update_post_meta( $post_id, 'trello_project_name', $card_name );
					update_post_meta( $post_id, 'trello_turnaround_time', $turn_around_time );
					update_post_meta( $post_id, 'trello_design_details', $design_details );
					update_post_meta( $post_id, 'trello_product_description', $description );
					update_post_meta( $post_id, 'trello_layout_type', $layout_type );


					update_post_meta( $post_id, 'product_ada', $ada );
					update_post_meta( $post_id, 'product_monuments', $monuments );
					update_post_meta( $post_id, 'product_channel_letters', $channelLetters );
					update_post_meta( $post_id, 'product_dimensional_letters', $dimensionalLetters );
					update_post_meta( $post_id, 'product_lightbox', $lightbox );
					update_post_meta( $post_id, 'product_vehicle_wrap', $vehicleWrap );
					update_post_meta( $post_id, 'product_wall_vinyl', $wallVinyl );
					update_post_meta( $post_id, 'product_print_cut', $printCut );
					update_post_meta( $post_id, 'product_logo_design', $logoDesign );
					update_post_meta( $post_id, 'product_custom_job', $customJob );


					update_post_meta( $post_id, 'trello_card_id', $card_id );
					update_post_meta( $post_id, 'trello_card_message', $project_details );
					update_post_meta( $post_id, 'trello_card_user_name', $full_name );
					update_post_meta( $post_id, 'trello_card_user_email', $email );
					update_post_meta( $post_id, 'trello_card_list', $list_name );
					update_post_meta( $post_id, 'trello_card_comment_from_admin', false );


					/**
					 * -- NEW STEP --
					 * Build the admin edit URL and prepend it to the existing Trello card description.
					 */
					$edit_url = admin_url( 'post.php?post=' . $post_id . '&action=edit' );

					// Prepend the link to what Trello currently has (i.e., $card_body->desc).
					// This ensures we do NOT overwrite the existing description.
					$desc_with_edit_link = "**WP Edit URL:** [Edit Post]({$edit_url})\n\n" . $card_body->desc;

					// Make a second request to Trello to update the card's description
					$update_url = "https://api.trello.com/1/cards/{$card_id}";
					$update_args = array(
						'key' => $api_key,
						'token' => $api_token,
						'desc' => $desc_with_edit_link, // updated desc with link on top
					);

					$update_response = wp_remote_request(
						$update_url,
						array(
							'method' => 'PUT',
							'body' => $update_args,
						)
					);

					// Optional: check if there's an error from the update call
					if ( is_wp_error( $update_response ) ) {
						error_log( 'Error updating card description with edit URL: ' . $update_response->get_error_message() );
					}
				}

				// Handle multiple file uploads
				if ( ! empty( $_FILES['fileUpload']['name'][0] ) || ! empty( $_FILES['bulkOrderFile']['name'] ) ) {
					$errors = array();
					$success_count = 0;

					// Handle regular file uploads
					if ( ! empty( $_FILES['fileUpload']['name'][0] ) ) {
						$uploadedfiles = $_FILES['fileUpload'];
						$file_count = count( $uploadedfiles['name'] );

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
									'date' => current_time( 'mysql' ),
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
					}

					// Handle bulk order file
					if ( ! empty( $_FILES['bulkOrderFile']['name'] ) ) {
						$bulk_file = $_FILES['bulkOrderFile'];
						$file_name = sanitize_file_name( $bulk_file['name'] );
						$file_type = $bulk_file['type'];
						$file_tmp_name = $bulk_file['tmp_name'];
						$file_error = $bulk_file['error'];
						$file_size = $bulk_file['size'];

						// Check for upload errors
						if ( $file_error !== UPLOAD_ERR_OK ) {
							$errors[] = 'Error uploading bulk order file: ' . $file_name;
						} else {
							// Validate file size if needed
							$max_file_size = 10 * 1024 * 1024; // 10 MB
							if ( $file_size > $max_file_size ) {
								$errors[] = 'Bulk order file size exceeds limit: ' . $file_name;
							} else {
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
									$errors[] = 'Error uploading bulk order file ' . $file_name . ': ' . $attachment_error;
								} else {
									$attachment_data = json_decode( $attachment_response, true );
									if ( $attachment_data && isset( $attachment_data['id'] ) ) {
										$attachment_info = array(
											'trello_id' => $attachment_data['id'],
											'name' => $file_name,
											'url' => $attachment_data['url'] ?? '',
											'date' => current_time( 'mysql' ),
											'type' => 'bulk_order',
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
										$success_count++;
									}
								}
							}
						}
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
					// No files uploaded; still try to register a webhook
					$webhook_result = $this->register_trello_webhook( $card_id, "Monitoring {$card_name}" );
					if ( is_wp_error( $webhook_result ) ) {
						error_log( 'Error creating Trello webhook: ' . $webhook_result->get_error_message() );
					} elseif ( isset( $webhook_result['id'] ) && ! is_wp_error( $post_id ) && $post_id ) {
						update_post_meta( $post_id, 'trello_webhook_id', $webhook_result['id'] );
					}

					wp_send_json_success( 'Card created successfully!' );
				}
			} else {
				// Log detailed error information for debugging
				$response_code = wp_remote_retrieve_response_code( $card_response );
				$response_message = wp_remote_retrieve_response_message( $card_response );
				$response_body = wp_remote_retrieve_body( $card_response );

				error_log( 'Trello Card Creation Failed:' );
				error_log( 'Response Code: ' . $response_code );
				error_log( 'Response Message: ' . $response_message );
				error_log( 'Response Body: ' . $response_body );
				error_log( 'Card Arguments: ' . print_r( $card_args, true ) );

				// Check for specific error conditions
				if ( $response_code >= 400 ) {
					$error_details = json_decode( $response_body, true );
					$error_message = isset( $error_details['message'] ) ?
						'Trello API Error: ' . $error_details['message'] :
						'Trello API Error: Unknown error (Code: ' . $response_code . ')';
					error_log( $error_message );
					throw new \Exception( $error_message );
				}
				throw new \Exception( 'Error creating card. trello-backend.php' );
			}
		} catch (\Exception $e) {
			error_log( 'Trello Form Submission Error: ' . $e->getMessage() );
			wp_send_json_error( [ 
				'message' => $e->getMessage(),
				'trace' => $e->getTraceAsString()
			] );
		}

		wp_die();
	}

	private function get_file_error_message( $code ) {
		switch ( $code ) {
			case UPLOAD_ERR_INI_SIZE:
				return 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
			case UPLOAD_ERR_FORM_SIZE:
				return 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
			case UPLOAD_ERR_PARTIAL:
				return 'The uploaded file was only partially uploaded';
			case UPLOAD_ERR_NO_FILE:
				return 'No file was uploaded';
			case UPLOAD_ERR_NO_TMP_DIR:
				return 'Missing a temporary folder';
			case UPLOAD_ERR_CANT_WRITE:
				return 'Failed to write file to disk';
			case UPLOAD_ERR_EXTENSION:
				return 'A PHP extension stopped the file upload';
			default:
				return 'Unknown upload error';
		}
	}
}