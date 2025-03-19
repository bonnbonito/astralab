<?php

namespace ASTRALAB;

use function add_action;
use function current_user_can;
use function get_role;
use function in_array;
use function is_wp_error;
use function update_user_meta;
use function wp_redirect;
use function wp_safe_redirect;
use function add_shortcode;
use function shortcode_atts;
use function get_password_reset_key;

class Users {
	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;
	/**
	 * Instance Control
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
		add_action( 'init', array( $this, 'add_client_role' ) );
		add_action( 'user_register', array( $this, 'create_trello_after_register' ) );
		add_action( 'wp_login', array( $this, 'redirect_client_after_login' ), 10, 2 );

		// Add AJAX action for recreating Trello board
		add_action( 'wp_ajax_recreate_trello_board', array( $this, 'ajax_recreate_trello_board' ) );

		// Add script for the admin area
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );

		// Add button to user profile
		add_action( 'edit_user_profile', array( $this, 'add_recreate_trello_button' ) );
		add_action( 'show_user_profile', array( $this, 'add_recreate_trello_button' ) );

		// Add temporary login link functionality
		add_action( 'edit_user_profile', array( $this, 'add_temp_login_link_section' ) );
		add_action( 'show_user_profile', array( $this, 'add_temp_login_link_section' ) );
		add_action( 'wp_ajax_generate_temp_login_link', array( $this, 'ajax_generate_temp_login_link' ) );
		add_action( 'init', array( $this, 'process_temp_login' ) );

		// Register shortcode for temporary login links
		add_shortcode( 'temp_login_link', array( $this, 'temp_login_link_shortcode' ) );

		add_filter( 'wp_new_user_notification_email', array( $this, 'custom_new_user_notification_email' ), 10, 3 );

		add_filter( 'wp_send_new_user_notification_to_user', array( $this, 'custom_new_user_notification_to_user' ), 10, 2 );

		// Store plain text password when user is created
		add_action( 'user_register', array( $this, 'store_plain_password' ), 9 );


		//Add logout button
		add_action( 'kadence_header_button', array( $this, 'logout_button' ) );
	}

	public function logout_button() {
		if ( is_user_logged_in() ) {
			?>
<a href="<?php echo wp_logout_url( home_url( '/login' ) ); ?>" class="button">Logout</a>
<?php
		}
	}

	public function astralab_trello_board_lists() {
		return apply_filters( 'astralab_trello_board_lists', array(
			'To Do',
			'In Progress',
			'Review/Approval',
			'Revisions',
			'Completed'
		)
		);
	}

	/**
	 * Store plain text password when user is created
	 * 
	 * @param int $user_id User ID.
	 */
	public function store_plain_password( $user_id ) {
		if ( isset( $_POST['pass1'] ) && ! empty( $_POST['pass1'] ) ) {
			update_user_meta( $user_id, '_plain_password', sanitize_text_field( $_POST['pass1'] ) );
		}
	}

	public function custom_new_user_notification_to_user( $send, $user ) {
		/** if client role, send email to client */
		if ( in_array( 'client', (array) $user->roles, true ) ) {
			return true;
		}

		return $send;
	}

	public function custom_new_user_notification_email( $wp_new_user_notification_email, $user, $blogname ) {
		// Create the login URL.
		$login_url = home_url( '/login' );

		// Get the plain text password from the user creation process
		$plain_password = get_user_meta( $user->ID, '_plain_password', true );
		if ( empty( $plain_password ) ) {
			// If no plain password is found, generate a random one
			$plain_password = wp_generate_password( 12, false );
			wp_set_password( $plain_password, $user->ID );
		}

		// Generate password reset key
		$key = get_password_reset_key( $user );
		if ( is_wp_error( $key ) ) {
			// Handle error - fallback to default reset link
			$reset_link = wp_lostpassword_url();
		} else {
			$reset_link = network_site_url( "wp-login.php?action=rp&key=$key&login=" . rawurlencode( $user->user_login ), 'login' );
		}

		// Get email template instance
		$email_template = \ASTRALAB\Email_Template::get_instance();

		// Prepare template data
		$template_data = array(
			'display_name' => $user->display_name,
			'user_login' => $user->user_login,
			'password' => $plain_password,
			'login_url' => $login_url,
			'reset_link' => $reset_link
		);
		// Get the welcome email HTML
		$message = '';
		if ( $email_template !== null ) {
			$message = $email_template->get_welcome_email( $template_data );
		}

		// Set the custom subject and message
		$wp_new_user_notification_email['subject'] = sprintf( 'Welcome to Astra Lab, %s!', $user->display_name ?: $user->user_login );
		$wp_new_user_notification_email['message'] = $message;
		$wp_new_user_notification_email['headers'] = array( 'Content-Type: text/html; charset=UTF-8' );

		// Delete the plain text password from user meta after sending the email
		delete_user_meta( $user->ID, '_plain_password' );

		return $wp_new_user_notification_email;
	}

	/**
	 * Add Client Role
	 */
	public function add_client_role() {
		$subscriber_role = get_role( 'subscriber' );

		if ( ! $subscriber_role ) {
			return;
		}

		$subscriber_capabilities = $subscriber_role->capabilities;

		add_role( 'client', 'Client', $subscriber_capabilities );
	}

	/**
	 * Redirect clients to order form after login
	 *
	 * @param string  $user_login Username.
	 * @param \WP_User $user       WP_User object of the logged-in user.
	 */
	public function redirect_client_after_login( $user_login, $user ) {
		// Check if user has the client role
		if ( in_array( 'client', (array) $user->roles, true ) ) {
			wp_safe_redirect( home_url( '/order-form' ) );
			exit;
		}
	}

	/**
	 * Enqueue scripts for admin area
	 * 
	 * @param string $hook Current admin page.
	 */
	public function enqueue_admin_scripts( $hook ) {
		if ( 'user-edit.php' !== $hook && 'profile.php' !== $hook ) {
			return;
		}

		wp_enqueue_script(
			'astralab-recreate-trello',
			ASTRALAB_DIR_URI . '/assets/js/recreate-trello.js',
			array(),
			filemtime( ASTRALAB_DIR_PATH . '/assets/js/recreate-trello.js' ),
			true
		);

		wp_localize_script(
			'astralab-recreate-trello',
			'astralabTrello',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( 'recreate_trello_nonce' ),
			)
		);

		// Add inline styles for the confirmation modal
		$modal_styles = '
			.trello-confirm-modal {
				display: none;
				position: fixed;
				z-index: 9999;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				overflow: auto;
				background-color: rgba(0,0,0,0.4);
			}
			.trello-confirm-content {
				background-color: #fefefe;
				margin: 15% auto;
				padding: 20px;
				border: 1px solid #ddd;
				width: 500px;
				max-width: 90%;
				border-radius: 4px;
				box-shadow: 0 4px 8px rgba(0,0,0,0.1);
			}
			.trello-confirm-header {
				margin-top: 0;
				color: #d63638;
			}
			.trello-confirm-buttons {
				margin-top: 20px;
				text-align: right;
			}
			.trello-confirm-buttons button {
				margin-left: 10px;
			}
			.trello-confirm-cancel {
				background: #f6f7f7;
				border-color: #ddd;
				color: #555;
			}
			.trello-confirm-proceed {
				background: #d63638;
				border-color: #d63638;
				color: #fff;
			}
		';

		wp_add_inline_style( 'wp-admin', $modal_styles );
	}

	/**
	 * Add button to recreate Trello board
	 * 
	 * @param \WP_User $user User object.
	 */
	public function add_recreate_trello_button( $user ) {
		if ( ! current_user_can( 'edit_user', $user->ID ) ) {
			return;
		}

		// Check if user already has a board
		$existing_board_id = get_user_meta( $user->ID, 'trello_board_id', true );
		$existing_board_url = get_user_meta( $user->ID, 'trello_board_short_url', true );

		?>
<div class="recreate-trello-section">
  <h2>Trello Board Management</h2>
  <table class="form-table">
    <tr>
      <th scope="row"><label for="recreate_trello_board">Trello Board</label></th>
      <td>
        <?php if ( ! empty( $existing_board_id ) && ! empty( $existing_board_url ) ) : ?>
        <p>
          <strong>Current Board ID:</strong> <?php echo esc_html( $existing_board_id ); ?>
          <a href="<?php echo esc_url( $existing_board_url ); ?>" target="_blank">View Board</a>
        </p>
        <?php endif; ?>

        <button type="button" id="recreate-trello-board" class="button button-secondary"
          data-user-id="<?php echo esc_attr( $user->ID ); ?>">
          <?php echo ! empty( $existing_board_id ) ? 'Recreate Trello Board' : 'Create Trello Board'; ?>
        </button>
        <span class="spinner" style="float: none; margin-top: 0;"></span>
        <p class="description">
          <?php if ( ! empty( $existing_board_id ) ) : ?>
          This will delete the existing board and create a new one. All data on the current board will be lost.
          <?php else : ?>
          Click to create a new Trello board for this user.
          <?php endif; ?>
        </p>
      </td>
    </tr>
  </table>
</div>

<!-- Confirmation Modal -->
<div id="trello-confirm-modal" class="trello-confirm-modal">
  <div class="trello-confirm-content">
    <h3 class="trello-confirm-header">Confirm Trello Board Recreation</h3>
    <p>Are you sure you want to recreate this Trello board?</p>
    <p><strong>Warning:</strong> This will <em>permanently delete</em> the existing board (ID:
      <?php echo esc_html( $existing_board_id ); ?>) and all its data including:
    </p>
    <ul style="margin-left: 20px; list-style-type: disc;">
      <li>All cards and their content</li>
      <li>All lists and their organization</li>
      <li>All attachments and comments</li>
      <li>All board settings and customizations</li>
    </ul>
    <p>A new empty board will be created with default lists. This action <strong>cannot be undone</strong>.</p>
    <div class="trello-confirm-buttons">
      <button type="button" id="trello-confirm-cancel" class="button trello-confirm-cancel">Cancel</button>
      <button type="button" id="trello-confirm-proceed" class="button trello-confirm-proceed">Yes, Delete and Recreate
        Board</button>
    </div>
  </div>
</div>
<?php
	}

	/**
	 * AJAX handler for recreating Trello board
	 */
	public function ajax_recreate_trello_board() {
		// Set proper content type for JSON response
		header( 'Content-Type: application/json' );

		// Check nonce
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'recreate_trello_nonce' ) ) {
			wp_send_json_error( array( 'message' => 'Security check failed.' ) );
			exit;
		}

		// Check user permissions
		if ( ! current_user_can( 'edit_users' ) ) {
			wp_send_json_error( array( 'message' => 'You do not have permission to perform this action.' ) );
			exit;
		}

		// Get user ID
		$user_id = isset( $_POST['user_id'] ) ? intval( $_POST['user_id'] ) : 0;
		if ( ! $user_id ) {
			wp_send_json_error( array( 'message' => 'Invalid user ID.' ) );
			exit;
		}

		try {
			// Run the create_trello_after_register function
			$result = $this->create_trello_after_register_ajax( $user_id );

			// Return success response
			wp_send_json_success( array(
				'message' => 'Trello board recreation process completed.',
				'result' => $result
			) );
		} catch (\Exception $e) {
			wp_send_json_error( array( 'message' => 'Error: ' . $e->getMessage() ) );
		}

		// Ensure we exit to prevent any additional output
		exit;
	}

	/**
	 * Modified version of create_trello_after_register for AJAX use
	 * This version returns results instead of redirecting
	 * 
	 * @param int $user_id User ID.
	 * @return array Result information.
	 */
	public function create_trello_after_register_ajax( $user_id ) {
		// Check user permissions
		if ( ! current_user_can( 'edit_user', $user_id ) ) {
			throw new \Exception( 'Permission denied.' );
		}

		// Check if role is 'client'
		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			throw new \Exception( 'User not found.' );
		}


		// Get Trello API instance
		$trello_api = \ASTRALAB\Trello_API::get_instance();
		if ( ! $trello_api ) {
			throw new \Exception( 'Trello API not available.' );
		}

		$result = array(
			'success' => false,
			'message' => 'Failed to create Trello board.',
			'old_board_deleted' => false,
			'old_board_id' => null,
		);

		// Check if user already has a board
		$existing_board_id = get_user_meta( $user_id, 'trello_board_id', true );

		// If there's an existing board, delete it first
		if ( ! empty( $existing_board_id ) ) {
			$result['old_board_id'] = $existing_board_id;

			// First, verify the board exists
			$board_check = $trello_api->trello_api_request( 'GET', "boards/{$existing_board_id}" );

			if ( is_wp_error( $board_check ) ) {
				// Board doesn't exist or can't be accessed
				$result['old_board_check_error'] = $board_check->get_error_message();
				error_log( "Error checking Trello board {$existing_board_id}: " . $board_check->get_error_message() );
			} elseif ( ! isset( $board_check['id'] ) ) {
				// Board doesn't exist
				$result['old_board_exists'] = false;
			} else {
				// Board exists, try to delete it
				$result['old_board_exists'] = true;

				$delete_response = $trello_api->trello_api_request( 'DELETE', "boards/{$existing_board_id}" );

				if ( is_wp_error( $delete_response ) ) {
					// Log the error but continue
					$error_message = $delete_response->get_error_message();
					error_log( "Error deleting Trello board {$existing_board_id}: {$error_message}" );
					$result['old_board_delete_error'] = $error_message;
				} else {
					$result['old_board_deleted'] = true;
				}
			}

			// Clear the existing board metadata regardless of deletion success
			// This ensures we don't keep references to boards that might not exist
			delete_user_meta( $user_id, 'trello_board_id' );
			delete_user_meta( $user_id, 'trello_board_short_url' );
			delete_user_meta( $user_id, 'trello_list_id' );
		}

		$full_name = $user->display_name ?: 'User';
		$board_name = $full_name . ' Board';

		// Prepare board creation arguments
		$board_args = array(
			'name' => $board_name,
			'defaultLists' => 'false', // Disable default lists
			'prefs_permissionLevel' => 'private',
			'idOrganization' => 'astralabtickets',
		);

		// Create the board using trello_api_request
		$board_response = $trello_api->trello_api_request( 'POST', 'boards', $board_args );

		// Handle errors in creating the board
		if ( is_wp_error( $board_response ) ) {
			$error_message = 'Error creating board: ' . $board_response->get_error_message();
			error_log( $error_message );
			throw new \Exception( $error_message );
		}

		if ( isset( $board_response['id'] ) ) {
			// Save board ID and short URL to user meta
			update_user_meta( $user_id, 'trello_board_id', $board_response['id'] );
			$result['board_id'] = $board_response['id'];

			if ( isset( $board_response['shortUrl'] ) ) {
				update_user_meta( $user_id, 'trello_board_short_url', $board_response['shortUrl'] );
				$result['board_url'] = $board_response['shortUrl'];
			}

			// Create custom lists
			$lists = $this->astralab_trello_board_lists();

			$list_ids = array();
			foreach ( $lists as $list_name ) {
				$list_args = array(
					'name' => $list_name,
					'idBoard' => $board_response['id'],
					'pos' => 'bottom'
				);

				$list_response = $trello_api->trello_api_request( 'POST', 'lists', $list_args );

				if ( ! is_wp_error( $list_response ) && isset( $list_response['id'] ) ) {
					$list_ids[ $list_name ] = $list_response['id'];

					// Store the "To Do" list ID for future reference
					if ( $list_name === 'To Do' ) {
						update_user_meta( $user_id, 'trello_list_id', $list_response['id'] );
						$result['list_id'] = $list_response['id'];
					}
				}
			}

			$result['success'] = true;
			if ( ! empty( $existing_board_id ) ) {
				$deletion_status = $result['old_board_deleted'] ? 'successfully deleted' : 'could not be deleted';
				$result['message'] = "Trello board recreated successfully! Old board {$deletion_status}.";
			} else {
				$result['message'] = 'Trello board created successfully!';
			}
		}

		return $result;
	}

	/**
	 * Create Trello board after user registration
	 * 
	 * @param int $user_id User ID.
	 */
	public function create_trello_after_register( $user_id ) {
		// Check user permissions
		if ( ! current_user_can( 'edit_user', $user_id ) ) {
			return;
		}

		// Check if role is 'client'
		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			return;
		}

		$user_role = get_role( 'client' );
		if ( ! $user_role ) {
			return;
		}


		// Get Trello API and backend instances
		$trello_api = \ASTRALAB\Trello_API::get_instance();
		$trello_backend = \ASTRALAB\Trello_Backend::get_instance();

		if ( ! $trello_backend && ! $trello_api ) {
			return;
		}

		// Check if user already has a board
		$existing_board_id = get_user_meta( $user_id, 'trello_board_id', true );

		// If there's an existing board, don't create a new one
		if ( ! empty( $existing_board_id ) ) {
			// Check if the board still exists
			$board_check = $trello_api->trello_api_request( 'GET', "boards/{$existing_board_id}" );

			// If the board exists and is valid, don't create a new one
			if ( ! is_wp_error( $board_check ) && isset( $board_check['id'] ) ) {
				if ( $trello_backend ) {
					// $trello_backend->astralab_redirect_with_message(
					// 	$user_id,
					// 	'info',
					// 	'User already has a Trello board. No new board created.'
					// );
				}
				return;
			}

			// If the board doesn't exist anymore, clear the metadata
			delete_user_meta( $user_id, 'trello_board_id' );
			delete_user_meta( $user_id, 'trello_board_short_url' );
			delete_user_meta( $user_id, 'trello_list_id' );
		}

		$full_name = $user->display_name ?: 'User';
		$board_name = $full_name . ' Board';

		// Prepare board creation arguments
		$board_args = array(
			'name' => $board_name,
			'defaultLists' => 'false', // Disable default lists
			'prefs_permissionLevel' => 'private',
			'idOrganization' => 'astralabtickets',
		);

		$board_response = $trello_api->trello_api_request( 'POST', 'boards', $board_args );

		// Handle errors in creating the board
		if ( is_wp_error( $board_response ) ) {
			if ( $trello_backend ) {
				//$trello_backend->astralab_redirect_with_message( $user_id, 'error', 'Error creating board: ' . $board_response->get_error_message() );
			}
			return;
		}

		if ( isset( $board_response['id'] ) ) {
			// Save board ID and short URL to user meta
			update_user_meta( $user_id, 'trello_board_id', $board_response['id'] );

			if ( isset( $board_response['shortUrl'] ) ) {
				update_user_meta( $user_id, 'trello_board_short_url', $board_response['shortUrl'] );
			}

			// Create custom lists
			$lists = array(
				'To Do',
				'In Progress',
				'Review/Approval',
				'Revisions',
				'Completed'
			);

			foreach ( $lists as $list_name ) {
				$list_args = array(
					'name' => $list_name,
					'idBoard' => $board_response['id'],
					'pos' => 'bottom'
				);

				$list_response = $trello_api->trello_api_request( 'POST', 'lists', $list_args );

				if ( ! is_wp_error( $list_response ) && isset( $list_response['id'] ) ) {
					// Store the "To Do" list ID for future reference
					if ( $list_name === 'To Do' ) {
						update_user_meta( $user_id, 'trello_list_id', $list_response['id'] );
					}
				}
			}

			// Redirect with success message
			if ( $trello_backend ) {
				// $trello_backend->astralab_redirect_with_message( $user_id, 'success', 'Trello board created successfully!' );
			}

		} else {
			if ( $trello_backend ) {
				// $trello_backend->astralab_redirect_with_message( $user_id, 'error', 'Failed to create Trello board. Check API credentials and permissions.' );
			}
		}

	}

	/**
	 * Add temporary login link section to user profile
	 * 
	 * @param \WP_User $user User object.
	 */
	public function add_temp_login_link_section( $user ) {
		if ( ! current_user_can( 'edit_user', $user->ID ) ) {
			return;
		}

		// Only administrators can generate temporary login links
		if ( ! current_user_can( 'administrator' ) ) {
			return;
		}

		wp_enqueue_script(
			'astralab-temp-login',
			ASTRALAB_DIR_URI . '/assets/js/temp-login.js',
			array( 'jquery' ),
			filemtime( ASTRALAB_DIR_PATH . '/assets/js/temp-login.js' ),
			true
		);

		wp_localize_script(
			'astralab-temp-login',
			'astralabTempLogin',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( 'temp_login_nonce' ),
			)
		);

		?>
<div class="temp-login-section">
  <h2>Temporary Login Link</h2>
  <table class="form-table">
    <tr>
      <th scope="row"><label for="temp_login_expiry">Link Expiration</label></th>
      <td>
        <select id="temp_login_expiry" name="temp_login_expiry">
          <option value="3600" selected>1 hour</option>
          <option value="86400">24 hours</option>
          <option value="604800">7 days</option>
          <option value="2592000">30 days</option>
        </select>
      </td>
    </tr>
    <tr>
      <th scope="row"><label for="temp_login_redirect">Redirect After Login</label></th>
      <td>
        <input type="text" id="temp_login_redirect" name="temp_login_redirect" class="regular-text"
          placeholder="<?php echo esc_attr( home_url() ); ?>" />
        <p class="description">Leave empty to use default redirect.</p>
      </td>
    </tr>
    <tr>
      <th scope="row"></th>
      <td>
        <button type="button" id="generate-temp-login" class="button button-primary"
          data-user-id="<?php echo esc_attr( $user->ID ); ?>">
          Generate Temporary Login Link
        </button>
        <span class="spinner" style="float: none; margin-top: 0;"></span>
      </td>
    </tr>
    <tr id="temp-login-result-row" style="display: none;">
      <th scope="row"><label for="temp_login_link">Login Link</label></th>
      <td>
        <div class="temp-login-result">
          <input type="text" id="temp_login_link" class="regular-text" readonly />
          <button type="button" id="copy-temp-login" class="button button-secondary">
            Copy Link
          </button>
          <p class="description">
            This link will expire after the selected time period. Anyone with this link can log in as this user until it
            expires.
          </p>
        </div>
      </td>
    </tr>
  </table>
</div>
<?php
	}

	/**
	 * AJAX handler for generating temporary login link
	 */
	public function ajax_generate_temp_login_link() {
		// Set proper content type for JSON response
		header( 'Content-Type: application/json' );

		// Check nonce
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'temp_login_nonce' ) ) {
			wp_send_json_error( array( 'message' => 'Security check failed.' ) );
			exit;
		}

		// Check user permissions
		if ( ! current_user_can( 'administrator' ) ) {
			wp_send_json_error( array( 'message' => 'You do not have permission to perform this action.' ) );
			exit;
		}

		// Get parameters
		$user_id = isset( $_POST['user_id'] ) ? intval( $_POST['user_id'] ) : 0;
		$expiry = isset( $_POST['expiry'] ) ? intval( $_POST['expiry'] ) : 3600; // Default: 1 hours
		$redirect_to = isset( $_POST['redirect_to'] ) ? esc_url_raw( wp_unslash( $_POST['redirect_to'] ) ) : '';

		if ( ! $user_id ) {
			wp_send_json_error( array( 'message' => 'Invalid user ID.' ) );
			exit;
		}

		// Check if user exists
		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			wp_send_json_error( array( 'message' => 'User not found.' ) );
			exit;
		}

		// Generate the temporary login link
		$login_link = $this->generate_temp_login_link( $user_id, $expiry, $redirect_to );

		if ( ! $login_link ) {
			wp_send_json_error( array( 'message' => 'Failed to generate login link.' ) );
			exit;
		}

		wp_send_json_success( array(
			'message' => 'Temporary login link generated successfully.',
			'link' => $login_link,
			'expires' => date( 'Y-m-d H:i:s', time() + $expiry ),
		) );
		exit;
	}

	/**
	 * Generate a temporary login link for a user
	 * 
	 * @param int    $user_id     User ID.
	 * @param int    $expiry      Expiration time in seconds.
	 * @param string $redirect_to Optional URL to redirect to after login.
	 * @return string|false Login URL or false on failure.
	 */
	public function generate_temp_login_link( $user_id, $expiry = 86400, $redirect_to = '' ) {
		if ( ! $user_id ) {
			return false;
		}

		// Generate a secure token
		$token = wp_generate_password( 32, false );

		// Calculate expiration time
		$expires = time() + $expiry;

		// Store the token in user meta
		$tokens = get_user_meta( $user_id, 'temp_login_tokens', true );
		if ( ! is_array( $tokens ) ) {
			$tokens = array();
		}

		// Add the new token
		$tokens[ $token ] = array(
			'expires' => $expires,
			'redirect_to' => $redirect_to,
			'created' => time(),
		);

		// Clean up expired tokens
		foreach ( $tokens as $key => $data ) {
			if ( $data['expires'] < time() ) {
				unset( $tokens[ $key ] );
			}
		}

		// Update user meta
		update_user_meta( $user_id, 'temp_login_tokens', $tokens );

		// Generate the login URL
		$login_url = add_query_arg(
			array(
				'temp_login' => 1,
				'user_id' => $user_id,
				'token' => $token,
			),
			home_url()
		);

		return $login_url;
	}

	/**
	 * Generate a temporary login link and return it as a formatted HTML link
	 * 
	 * @param int    $user_id     User ID.
	 * @param int    $expiry      Expiration time in seconds.
	 * @param string $redirect_to Optional URL to redirect to after login.
	 * @param string $link_text   Optional text for the link.
	 * @return string HTML link or empty string on failure.
	 */
	public function get_temp_login_link_html( $user_id, $expiry = 86400, $redirect_to = '', $link_text = '' ) {
		$url = $this->generate_temp_login_link( $user_id, $expiry, $redirect_to );

		if ( ! $url ) {
			return '';
		}

		if ( empty( $link_text ) ) {
			$user = get_user_by( 'id', $user_id );
			$link_text = sprintf( 'Login as %s', $user ? $user->display_name : 'User' );
		}

		return sprintf(
			'<a href="%s" class="temp-login-link">%s</a>',
			esc_url( $url ),
			esc_html( $link_text )
		);
	}

	/**
	 * Process temporary login request
	 */
	public function process_temp_login() {
		// Check if this is a temporary login request
		if ( ! isset( $_GET['temp_login'] ) || ! isset( $_GET['user_id'] ) || ! isset( $_GET['token'] ) ) {
			return;
		}

		// Get parameters
		$user_id = intval( $_GET['user_id'] );
		$token = sanitize_text_field( wp_unslash( $_GET['token'] ) );

		// Validate user ID
		if ( ! $user_id ) {
			wp_die( 'Invalid login request.', 'Login Error', array( 'response' => 403 ) );
		}

		// Get user
		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			wp_die( 'User not found.', 'Login Error', array( 'response' => 404 ) );
		}

		// Get tokens
		$tokens = get_user_meta( $user_id, 'temp_login_tokens', true );
		if ( ! is_array( $tokens ) || ! isset( $tokens[ $token ] ) ) {
			wp_die( 'Invalid or expired login link.', 'Login Error', array( 'response' => 403 ) );
		}

		// Check if token is expired
		$token_data = $tokens[ $token ];
		if ( $token_data['expires'] < time() ) {
			// Remove expired token
			unset( $tokens[ $token ] );
			update_user_meta( $user_id, 'temp_login_tokens', $tokens );
			wp_die( 'Login link has expired.', 'Login Error', array( 'response' => 403 ) );
		}

		// Token is valid, log the user in
		wp_set_auth_cookie( $user_id, false );

		// Remove the used token (one-time use)
		unset( $tokens[ $token ] );
		update_user_meta( $user_id, 'temp_login_tokens', $tokens );

		// Log the login
		$this->log_temp_login( $user_id, $_SERVER['REMOTE_ADDR'] );

		// Redirect after login
		$redirect_to = ! empty( $token_data['redirect_to'] ) ? $token_data['redirect_to'] : home_url();
		wp_safe_redirect( $redirect_to );
		exit;
	}

	/**
	 * Log temporary login
	 * 
	 * @param int    $user_id User ID.
	 * @param string $ip      IP address.
	 */
	private function log_temp_login( $user_id, $ip ) {
		$logs = get_user_meta( $user_id, 'temp_login_logs', true );
		if ( ! is_array( $logs ) ) {
			$logs = array();
		}

		// Add new log entry
		$logs[] = array(
			'time' => current_time( 'mysql' ),
			'ip' => $ip,
		);

		// Keep only the last 10 entries
		if ( count( $logs ) > 10 ) {
			$logs = array_slice( $logs, -10 );
		}

		update_user_meta( $user_id, 'temp_login_logs', $logs );
	}

	/**
	 * Shortcode for generating temporary login links
	 * 
	 * Usage: [temp_login_link user_id="123" expiry="86400" redirect_to="/dashboard" text="Login here"]
	 * 
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function temp_login_link_shortcode( $atts ) {
		// Only allow administrators to use this shortcode
		if ( ! current_user_can( 'administrator' ) ) {
			return '';
		}

		$atts = shortcode_atts(
			array(
				'user_id' => 0,
				'expiry' => 86400,
				'redirect_to' => '',
				'text' => '',
			),
			$atts,
			'temp_login_link'
		);

		$user_id = intval( $atts['user_id'] );
		if ( ! $user_id ) {
			return '<p class="error">Error: Missing or invalid user ID.</p>';
		}

		$expiry = intval( $atts['expiry'] );
		$redirect_to = esc_url_raw( $atts['redirect_to'] );
		$link_text = sanitize_text_field( $atts['text'] );

		return $this->get_temp_login_link_html( $user_id, $expiry, $redirect_to, $link_text );
	}
}