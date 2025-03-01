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
			'defaultLists' => 'true',
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

			// Retrieve the lists for the created board
			$lists_response = $trello_api->trello_api_request( 'GET', "boards/{$board_response['id']}/lists" );

			if ( ! is_wp_error( $lists_response ) && is_array( $lists_response ) ) {
				foreach ( $lists_response as $list ) {
					if ( isset( $list['name'] ) && $list['name'] === 'To Do' && isset( $list['id'] ) ) {
						update_user_meta( $user_id, 'trello_list_id', $list['id'] );
						$result['list_id'] = $list['id'];
						break;
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

		if ( ! in_array( $user_role->name, $user->roles, true ) ) {
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
					$trello_backend->astralab_redirect_with_message(
						$user_id,
						'info',
						'User already has a Trello board. No new board created.'
					);
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
			'defaultLists' => 'true',
			'prefs_permissionLevel' => 'private',
			'idOrganization' => 'astralabtickets',
		);

		$board_response = $trello_api->trello_api_request( 'POST', 'boards', $board_args );

		// Handle errors in creating the board
		if ( is_wp_error( $board_response ) ) {
			if ( $trello_backend ) {
				$trello_backend->astralab_redirect_with_message( $user_id, 'error', 'Error creating board: ' . $board_response->get_error_message() );
			}
			return;
		}

		if ( isset( $board_response['id'] ) ) {
			// Save board ID and short URL to user meta
			update_user_meta( $user_id, 'trello_board_id', $board_response['id'] );

			if ( isset( $board_response['shortUrl'] ) ) {
				update_user_meta( $user_id, 'trello_board_short_url', $board_response['shortUrl'] );
			}

			// Retrieve the lists for the created board
			$lists_response = $trello_api->trello_api_request( 'GET', "boards/{$board_response['id']}/lists" );

			if ( ! is_wp_error( $lists_response ) && is_array( $lists_response ) ) {
				foreach ( $lists_response as $list ) {
					if ( isset( $list['name'] ) && $list['name'] === 'To Do' && isset( $list['id'] ) ) {
						update_user_meta( $user_id, 'trello_list_id', $list['id'] );
						break;
					}
				}
			}

			// Redirect with success message
			if ( $trello_backend ) {
				$trello_backend->astralab_redirect_with_message( $user_id, 'success', 'Trello board created successfully!' );
			}

		} else {
			if ( $trello_backend ) {
				$trello_backend->astralab_redirect_with_message( $user_id, 'error', 'Failed to create Trello board. Check API credentials and permissions.' );
			}
		}
	}
}