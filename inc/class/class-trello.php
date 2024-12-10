<?php

namespace ASTRALAB;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Trello {
	/**
	 * Instance of this class.
	 *
	 * @var Trello|null
	 */
	private static $instance = null;

	/**
	 * Option name for Trello settings.
	 *
	 * @var string
	 */
	private $option_name = 'astralab_trello_settings';

	/**
	 * Instance Control.
	 */
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

		// AJAX handlers for creating Trello cards
		add_action( 'wp_ajax_handle_trello_form_submission', array( $this, 'handle_trello_form_submission_ajax' ) );
		add_action( 'wp_ajax_nopriv_handle_trello_form_submission', array( $this, 'handle_trello_form_submission_ajax' ) );

		// Shortcode for Trello form
		add_shortcode( 'trello_form', array( $this, 'trello_shortcode' ) );

		// Register settings page for Trello credentials
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		add_action( 'admin_init', array( $this, 'register_trello_settings' ) );

		// Hide Kadence Post Meta Section example
		add_filter( 'kadence_classic_meta_box_post_types', array( $this, 'hide_kadence_post_meta_section' ) );

		// Add meta boxes for trello_card_id and message on trello-card post type
		add_action( 'add_meta_boxes', array( $this, 'add_trello_card_metabox' ) );

		// Add Create Trello Board button on user profile
		add_action( 'edit_user_profile', array( $this, 'add_create_trello_board_checkbox' ) );
		add_action( 'show_user_profile', array( $this, 'add_create_trello_board_checkbox' ) );

		// Handle form submission for creating a Trello board
		add_action( 'admin_post_create_user_trello_board', array( $this, 'handle_create_user_trello_board' ) );

		// Create Trello Board
		add_action( 'personal_options_update', array( $this, 'astralab_handle_create_trello_board_on_profile_save' ) );
		add_action( 'edit_user_profile_update', array( $this, 'astralab_handle_create_trello_board_on_profile_save' ) );

		add_action( 'admin_notices', array( $this, 'astralab_show_trello_board_message_checkbox' ) );
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
				'ajax_url'          => admin_url( 'admin-ajax.php' ),
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
<form id="trello-form" enctype="multipart/form-data">
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
		// Verify the nonce for security
		check_ajax_referer( 'trello_form_action', 'trello_form_nonce' );

		// Get Trello options from DB
		$options   = get_option( $this->option_name );
		$api_key   = isset( $options['trello_api_key'] ) ? $options['trello_api_key'] : '';
		$api_token = isset( $options['trello_api_token'] ) ? $options['trello_api_token'] : '';
		$list_id   = isset( $options['trello_list_id'] ) ? $options['trello_list_id'] : '';

		if ( empty( $api_key ) || empty( $api_token ) || empty( $list_id ) ) {
			wp_send_json_error( 'Trello API credentials or List ID not set. Please configure them in Trello Settings.' );
		}

		// Sanitize and get form data
		$card_name = sanitize_text_field( $_POST['card_name'] );
		$card_desc = sanitize_textarea_field( $_POST['card_desc'] );

		// Get current user data
		$user = wp_get_current_user();
		if ( $user && $user->ID ) {
			$full_name = $user->display_name;
			$email     = $user->user_email;
		} else {
			$full_name = 'Guest';
			$email     = 'N/A';
		}

		// Construct the Markdown description
		$user_line  = '**User:** ' . ( ! empty( $full_name ) ? $full_name : 'N/A' );
		$email_line = '**Email:** ' . ( ! empty( $email ) ? $email : 'N/A' );
		$md_desc    = $user_line . "\n" . $email_line . "\n\n" . "**Message:**\n" . $card_desc;

		// Create the Trello card
		$card_url  = 'https://api.trello.com/1/cards';
		$card_args = array(
			'key'    => $api_key,
			'token'  => $api_token,
			'idList' => $list_id,
			'name'   => $card_name,
			'desc'   => $md_desc,
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
			$post_id     = wp_insert_post(
				array(
					'post_type'   => 'trello-card',
					'post_title'  => $card_name,
					'post_status' => 'publish',
					'post_author' => $post_author,
				)
			);

			if ( ! is_wp_error( $post_id ) && $post_id ) {
				update_post_meta( $post_id, 'trello_card_id', $card_id );
				update_post_meta( $post_id, 'trello_card_message', $card_desc );
				update_post_meta( $post_id, 'trello_card_user_name', $full_name );
				update_post_meta( $post_id, 'trello_card_user_email', $email );
			}

			// Handle multiple file uploads
			if ( ! empty( $_FILES['file_upload']['name'][0] ) ) {
				$uploadedfiles = $_FILES['file_upload'];
				$file_count    = count( $uploadedfiles['name'] );
				$errors        = array();
				$success_count = 0;

				for ( $i = 0; $i < $file_count; $i++ ) {
					$file_name     = sanitize_file_name( $uploadedfiles['name'][ $i ] );
					$file_type     = $uploadedfiles['type'][ $i ];
					$file_tmp_name = $uploadedfiles['tmp_name'][ $i ];
					$file_error    = $uploadedfiles['error'][ $i ];
					$file_size     = $uploadedfiles['size'][ $i ];

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
						'file'  => new \CURLFile( $file_tmp_name, $file_type, $file_name ),
						'key'   => $api_key,
						'token' => $api_token,
					);

					// Attach the file to the Trello card
					$attachment_url = "https://api.trello.com/1/cards/{$card_id}/attachments";
					$ch             = curl_init();
					curl_setopt( $ch, CURLOPT_URL, $attachment_url );
					curl_setopt( $ch, CURLOPT_POST, 1 );
					curl_setopt( $ch, CURLOPT_POSTFIELDS, $file_data );
					curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

					$attachment_response = curl_exec( $ch );
					$attachment_error    = curl_error( $ch );
					curl_close( $ch );

					if ( $attachment_error ) {
						$errors[] = 'Error uploading attachment for file ' . $file_name . ': ' . $attachment_error;
						continue;
					}

					++$success_count;
				}

				// Generate response message
				if ( $success_count > 0 && empty( $errors ) ) {
					wp_send_json_success( 'Card created and all files attached successfully!' );
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

	/**
	 * Add Trello Settings page under "Settings".
	 */
	public function add_options_page() {
		add_options_page(
			'Trello Settings',
			'Trello Settings',
			'manage_options',
			'astralab-trello-settings',
			array( $this, 'render_options_page' )
		);
	}

	/**
	 * Register Trello Settings and fields.
	 */
	public function register_trello_settings() {
		register_setting(
			'astralab_trello_group',
			$this->option_name,
			array( $this, 'sanitize_settings' )
		);

		add_settings_section(
			'astralab_trello_section',
			'Configure Trello API Credentials',
			null,
			'astralab-trello-settings'
		);

		add_settings_field(
			'trello_api_key',
			'API Key',
			array( $this, 'render_api_key_field' ),
			'astralab-trello-settings',
			'astralab_trello_section'
		);

		add_settings_field(
			'trello_api_token',
			'API Token',
			array( $this, 'render_api_token_field' ),
			'astralab-trello-settings',
			'astralab_trello_section'
		);

		add_settings_field(
			'trello_list_id',
			'List ID',
			array( $this, 'render_list_id_field' ),
			'astralab-trello-settings',
			'astralab_trello_section'
		);
	}

	/**
	 * Sanitize the input from the settings fields.
	 *
	 * @param array $input The input values.
	 * @return array
	 */
	public function sanitize_settings( $input ) {
		$new_input                     = array();
		$new_input['trello_api_key']   = isset( $input['trello_api_key'] ) ? sanitize_text_field( $input['trello_api_key'] ) : '';
		$new_input['trello_api_token'] = isset( $input['trello_api_token'] ) ? sanitize_text_field( $input['trello_api_token'] ) : '';
		$new_input['trello_list_id']   = isset( $input['trello_list_id'] ) ? sanitize_text_field( $input['trello_list_id'] ) : '';

		return $new_input;
	}

	/**
	 * Render API Key field.
	 */
	public function render_api_key_field() {
		$options = get_option( $this->option_name );
		$value   = isset( $options['trello_api_key'] ) ? esc_attr( $options['trello_api_key'] ) : '';
		echo "<input type='text' name='{$this->option_name}[trello_api_key]' value='{$value}' class='regular-text' />";
	}

	/**
	 * Render API Token field.
	 */
	public function render_api_token_field() {
		$options = get_option( $this->option_name );
		$value   = isset( $options['trello_api_token'] ) ? esc_attr( $options['trello_api_token'] ) : '';
		echo "<input type='text' name='{$this->option_name}[trello_api_token]' value='{$value}' class='regular-text' />";
	}

	/**
	 * Render List ID field.
	 */
	public function render_list_id_field() {
		$options = get_option( $this->option_name );
		$value   = isset( $options['trello_list_id'] ) ? esc_attr( $options['trello_list_id'] ) : '';
		echo "<input type='text' name='{$this->option_name}[trello_list_id]' value='{$value}' class='regular-text' />";
	}

	/**
	 * Render the options page.
	 */
	public function render_options_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
<div class="wrap">
	<h1>Trello Settings</h1>
	<form method="post" action="options.php">
		<?php
					settings_fields( 'astralab_trello_group' );
					do_settings_sections( 'astralab-trello-settings' );
					submit_button();
		?>
	</form>
</div>
		<?php
	}

	/**
	 * Hide Kadence Post Meta Section example (adjust as needed)
	 */
	public function hide_kadence_post_meta_section( $post_types ) {
		return array( 'test' );
	}

	/**
	 * Add a meta box to display the trello_card_id and the message
	 */
	public function add_trello_card_metabox() {
		add_meta_box(
			'trello_card_info',
			'Trello Card Info',
			array( $this, 'render_trello_card_metabox' ),
			'trello-card',
			'side',
			'default'
		);

		add_meta_box(
			'trello_card_message',
			'Trello Card Message',
			array( $this, 'render_trello_card_message_metabox' ),
			'trello-card',
			'normal',
			'default'
		);
	}

	/**
	 * Render the trello_card_message meta box content
	 */
	public function render_trello_card_message_metabox( $post ) {
		$trello_card_message = get_post_meta( $post->ID, 'trello_card_message', true );
		if ( ! empty( $trello_card_message ) ) {
			echo '<p><strong>Message:</strong></p>';
			echo '<table class="widefat" style="border:1px solid #ddd; border-collapse: collapse; width:100%;">';
			echo '<tbody>';
			$lines = explode( "\n", $trello_card_message );
			foreach ( $lines as $line ) {
				$line = trim( $line );
				if ( ! empty( $line ) ) {
					echo '<tr><td style="border:1px solid #ddd; padding:10px;">' . wp_kses_post( $line ) . '</td></tr>';
				}
			}
			echo '</tbody>';
			echo '</table>';
		} else {
			echo '<p>No message found.</p>';
		}
	}

	/**
	 * Render the trello_card_id meta box content
	 */
	public function render_trello_card_metabox( $post ) {
		$trello_card_id = get_post_meta( $post->ID, 'trello_card_id', true );
		if ( ! empty( $trello_card_id ) ) {
			echo '<p><strong>Trello Card ID:</strong> ' . esc_html( $trello_card_id ) . '</p>';
		} else {
			echo '<p>No Trello Card ID found.</p>';
		}
	}

	/**
	 * Add a checkbox to user profile to create Trello Board
	 */
	public function add_create_trello_board_checkbox( $user ) {
		if ( ! current_user_can( 'edit_user', $user->ID ) ) {
			return;
		}
		$trello_board_id = get_user_meta( $user->ID, 'trello_board_id', true );
		$trello_url      = get_user_meta( $user->ID, 'trello_board_short_url', true );

		?>
<h2>Create Trello Board</h2>
<table class="form-table">
	<tr>
		<th scope="row"><label for="create_trello_board">Trello Board</label></th>
		<?php
		if ( ! empty( $trello_board_id ) ) {
			echo '<td><strong>Trello Board ID:</strong> ' . esc_html( $trello_board_id ) . ' <a href="' . $trello_url . '" target="_blank">View Board</a></td>';
		} else {
			?>
		<td>
			<label for="create_trello_board">
				<input type="checkbox" name="create_trello_board" id="create_trello_board" value="1">
				Create Trello Board Named '<?php echo esc_html( $user->display_name ); ?> Board'
			</label>
		</td>
	</tr>
</table>
			<?php
		}
	}

	/**
	 * Handle creating Trello board on profile save
	 */
	public function astralab_handle_create_trello_board_on_profile_save( $user_id ) {
		// Check permissions
		if ( ! current_user_can( 'edit_user', $user_id ) ) {
			return;
		}

		// If the checkbox wasn't checked, do nothing
		if ( empty( $_POST['create_trello_board'] ) ) {
			return;
		}

		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			return;
		}

		$full_name = $user->display_name;
		if ( empty( $full_name ) ) {
			$full_name = 'User';
		}
		$board_name = $full_name . ' Board';

		// Retrieve Trello API credentials from options
		$options   = get_option( 'astralab_trello_settings', array() );
		$api_key   = isset( $options['trello_api_key'] ) ? $options['trello_api_key'] : '';
		$api_token = isset( $options['trello_api_token'] ) ? $options['trello_api_token'] : '';

		if ( empty( $api_key ) || empty( $api_token ) ) {
			$this->astralab_redirect_with_message( $user_id, 'error', 'Trello API credentials not set.' );
			return;
		}

		$board_url  = 'https://api.trello.com/1/boards/';
		$board_args = array(
			'key'                   => $api_key,
			'token'                 => $api_token,
			'name'                  => $board_name,
			'defaultLists'          => 'true',
			'prefs_permissionLevel' => 'private',
			'idOrganization'        => 'astralabtickets',
		);

		$board_response = wp_remote_post(
			$board_url,
			array(
				'body' => $board_args,
			)
		);

		if ( is_wp_error( $board_response ) ) {
			$this->astralab_redirect_with_message( $user_id, 'error', 'Error creating board: ' . $board_response->get_error_message() );
			return;
		}

		$board_body = json_decode( wp_remote_retrieve_body( $board_response ), true );

		if ( isset( $board_body['id'] ) ) {
			// Add the board ID to the user meta
			update_user_meta( $user_id, 'trello_board_id', $board_body['id'] );

			if ( isset( $board_body['shortUrl'] ) ) {
				update_user_meta( $user_id, 'trello_board_short_url', $board_body['shortUrl'] );
			}

			// Board created successfully
			$this->astralab_redirect_with_message( $user_id, 'success', 'Trello board created successfully!' );

		} else {
			$this->astralab_redirect_with_message( $user_id, 'error', 'Failed to create Trello board. Check API credentials and permissions.' );
		}
	}

	// Helper function to redirect back to the user edit page with a message
	public function astralab_redirect_with_message( $user_id, $type = 'error', $message = '' ) {
		$redirect_url = add_query_arg(
			array(
				'user_id' => $user_id,
				'updated' => 'true',
				'type'    => $type,
				'message' => urlencode( $message ),
			),
			admin_url( 'user-edit.php' )
		);
		wp_safe_redirect( $redirect_url );
		exit;
	}

	/**
	 * Display a message after redirect if 'message' is set
	 */
	public function astralab_show_trello_board_message_checkbox() {
		if ( isset( $_GET['updated'] ) && $_GET['updated'] === 'true' && isset( $_GET['message'] ) ) {
			$message = urldecode( $_GET['message'] );
			$type    = isset( $_GET['type'] ) ? sanitize_text_field( $_GET['type'] ) : 'error';

			$class = ( $type === 'success' ) ? 'notice-success' : 'notice-error';

			echo '<div class="notice ' . esc_attr( $class ) . ' is-dismissible"><p>' . esc_html( $message ) . '</p></div>';
		}
	}

	/**
	 * Show an admin notice after redirect if 'message' is set.
	 */
	public function show_trello_board_message() {
		if ( isset( $_GET['updated'] ) && $_GET['updated'] === 'true' && isset( $_GET['message'] ) ) {
			$message = urldecode( $_GET['message'] );
			echo '<div class="notice notice-success is-dismissible"><p>' . esc_html( $message ) . '</p></div>';
		}
	}
}
