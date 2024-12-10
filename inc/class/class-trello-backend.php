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
	 * Instance Control
	 */


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
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		add_action( 'admin_init', array( $this, 'register_trello_settings' ) );

		// Add meta boxes for Trello card post type
		add_action( 'add_meta_boxes', array( $this, 'add_trello_card_metabox' ) );

		// Add Create Trello Board button on user profile
		add_action( 'edit_user_profile', array( $this, 'add_create_trello_board_checkbox' ) );
		add_action( 'show_user_profile', array( $this, 'add_create_trello_board_checkbox' ) );

		// Create Trello Board
		add_action( 'personal_options_update', array( $this, 'astralab_handle_create_trello_board_on_profile_save' ) );
		add_action( 'edit_user_profile_update', array( $this, 'astralab_handle_create_trello_board_on_profile_save' ) );

		add_action( 'admin_notices', array( $this, 'astralab_show_trello_board_message_checkbox' ) );
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
			echo '<td>
			<p><strong>Trello Board ID:</strong> ' . esc_html( $trello_board_id ) . ' <a href="' . esc_url( $trello_url ) . '" target="_blank">View Board</a></p>
			<p><strong>List ID:</strong> ' . esc_html( get_user_meta( $user->ID, 'trello_list_id', true ) ) . '</p>
			</td>';
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

			// Now retrieve the lists for this board to find the "To Do" list
			$lists_url = add_query_arg(
				array(
					'key'   => $api_key,
					'token' => $api_token,
				),
				'https://api.trello.com/1/boards/' . $board_body['id'] . '/lists'
			);

			$lists_response = wp_remote_get( $lists_url );

			if ( ! is_wp_error( $lists_response ) ) {
				$lists_body = json_decode( wp_remote_retrieve_body( $lists_response ), true );

				if ( is_array( $lists_body ) ) {
					foreach ( $lists_body as $list ) {
						if ( isset( $list['name'] ) && $list['name'] === 'To Do' && isset( $list['id'] ) ) {
							update_user_meta( $user_id, 'trello_list_id', $list['id'] );
							break;
						}
					}
				}
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
}
