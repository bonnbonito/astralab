<?php

namespace ASTRALAB;

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
		add_action( 'wp_ajax_handle_trello_form_submission', array( $this, 'handle_trello_form_submission_ajax' ) );
		add_action( 'wp_ajax_nopriv_handle_trello_form_submission', array( $this, 'handle_trello_form_submission_ajax' ) );
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
		$options      = get_option( $this->option_name );
		$callback_url = $options['trello_webhook_callback'] ?? '';

		// Validate inputs
		if ( empty( $callback_url ) || empty( $id_model ) ) {
			return new \WP_Error( 'trello_missing_credentials', 'Missing callback URL or id_model.' );
		}

		// Prepare request payload
		$body = array(
			'callbackURL' => $callback_url,
			'idModel'     => $id_model,
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
		$trello_url      = get_user_meta( $user->ID, 'trello_board_short_url', true );
		$trello_list_id  = get_user_meta( $user->ID, 'trello_list_id', true );

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

		$full_name  = $user->display_name ?: 'User';
		$board_name = $full_name . ' Board';

		// Prepare board creation arguments
		$board_args = array(
			'name'                  => $board_name,
			'defaultLists'          => 'true',
			'prefs_permissionLevel' => 'private',
			'idOrganization'        => 'astralabtickets',
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
				'type'    => $type,
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
			$type    = isset( $_GET['type'] ) ? sanitize_text_field( $_GET['type'] ) : 'error';

			$class = ( $type === 'success' ) ? 'notice-success' : 'notice-error';

			echo '<div class="notice ' . esc_attr( $class ) . ' is-dismissible"><p>' . esc_html( $message ) . '</p></div>';
		}
	}
}