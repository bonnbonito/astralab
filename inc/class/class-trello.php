<?php

namespace ASTRALAB;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Trello {
	/**
	 * Instance of this class.
	 *
	 * @var Trello|null
	 */
	private static $instance = null;

	/**
	 * Option name for Trello credentials.
	 *
	 * @var string
	 */
	private $option_name = 'astralab_trello_options';

	/**
	 * Stored options.
	 *
	 * @var array
	 */
	private $options = array();

	/**
	 * Trello OAuth endpoints.
	 */
	private $request_token_url = 'https://trello.com/1/OAuthGetRequestToken';
	private $authorize_url     = 'https://trello.com/1/OAuthAuthorizeToken';
	private $access_token_url  = 'https://trello.com/1/OAuthGetAccessToken';

	/**
	 * Callback URL (must match the one set in Trello App Settings)
	 * This should be a URL on your site where Trello will redirect after authorization.
	 * For example: https://yoursite.com/wp-admin/options-general.php?page=astralab-trello
	 * Ensure you handle the 'oauth_verifier' parameter in this page load.
	 */
	private $callback_url;

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
	 * Initializes hooks and loads options.
	 */
	public function __construct() {
		$this->options = get_option(
			$this->option_name,
			array(
				'oauth_consumer_key'    => '',
				'oauth_consumer_secret' => '',
				'oauth_token'           => '',
				'oauth_token_secret'    => '',
				'board_id'              => '',
				'list_id'               => '',
			)
		);

		$this->callback_url = admin_url( 'options-general.php?page=astralab-trello' );

		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );

		// Handle OAuth callbacks when Trello redirects back
		add_action( 'admin_init', array( $this, 'maybe_handle_oauth_callback' ) );
	}

	/**
	 * Add the Trello Options page under "Settings".
	 */
	public function add_options_page() {
		add_options_page(
			'Trello Settings',
			'Trello Settings',
			'manage_options',
			'astralab-trello',
			array( $this, 'render_options_page' )
		);
	}

	/**
	 * Register settings and fields.
	 */
	public function register_settings() {
		register_setting( 'astralab_trello_group', $this->option_name, array( $this, 'sanitize_options' ) );

		add_settings_section(
			'astralab_trello_section',
			'Configure Trello OAuth',
			null,
			'astralab-trello'
		);

		add_settings_field(
			'oauth_consumer_key',
			'OAuth Consumer Key',
			array( $this, 'render_field_consumer_key' ),
			'astralab-trello',
			'astralab_trello_section'
		);

		add_settings_field(
			'oauth_consumer_secret',
			'OAuth Consumer Secret',
			array( $this, 'render_field_consumer_secret' ),
			'astralab-trello',
			'astralab_trello_section'
		);

		add_settings_field(
			'board_id',
			'Default Board ID (optional)',
			array( $this, 'render_field_board_id' ),
			'astralab-trello',
			'astralab_trello_section'
		);

		add_settings_field(
			'list_id',
			'Default List ID (optional)',
			array( $this, 'render_field_list_id' ),
			'astralab-trello',
			'astralab_trello_section'
		);
	}

	public function sanitize_options( $input ) {
		$new_input                          = array();
		$new_input['oauth_consumer_key']    = isset( $input['oauth_consumer_key'] ) ? sanitize_text_field( $input['oauth_consumer_key'] ) : '';
		$new_input['oauth_consumer_secret'] = isset( $input['oauth_consumer_secret'] ) ? sanitize_text_field( $input['oauth_consumer_secret'] ) : '';
		$new_input['board_id']              = isset( $input['board_id'] ) ? sanitize_text_field( $input['board_id'] ) : '';
		$new_input['list_id']               = isset( $input['list_id'] ) ? sanitize_text_field( $input['list_id'] ) : '';

		// Preserve existing tokens if they exist and are not being reset
		$new_input['oauth_token']        = isset( $this->options['oauth_token'] ) ? $this->options['oauth_token'] : '';
		$new_input['oauth_token_secret'] = isset( $this->options['oauth_token_secret'] ) ? $this->options['oauth_token_secret'] : '';

		return $new_input;
	}

	public function render_field_consumer_key() {
		printf(
			'<input type="text" id="oauth_consumer_key" name="%s[oauth_consumer_key]" value="%s" class="regular-text" />',
			esc_attr( $this->option_name ),
			esc_attr( $this->options['oauth_consumer_key'] )
		);
	}

	public function render_field_consumer_secret() {
		printf(
			'<input type="text" id="oauth_consumer_secret" name="%s[oauth_consumer_secret]" value="%s" class="regular-text" />',
			esc_attr( $this->option_name ),
			esc_attr( $this->options['oauth_consumer_secret'] )
		);
	}

	public function render_field_board_id() {
		printf(
			'<input type="text" id="board_id" name="%s[board_id]" value="%s" class="regular-text" />',
			esc_attr( $this->option_name ),
			esc_attr( $this->options['board_id'] )
		);
	}

	public function render_field_list_id() {
		printf(
			'<input type="text" id="list_id" name="%s[list_id]" value="%s" class="regular-text" />',
			esc_attr( $this->option_name ),
			esc_attr( $this->options['list_id'] )
		);
	}

	/**
	 * Render the options page.
	 * Include a button to start the OAuth process if no token is set.
	 */
	public function render_options_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$has_token = ! empty( $this->options['oauth_token'] ) && ! empty( $this->options['oauth_token_secret'] );

		?>
<div class="wrap">
	<h1><?php esc_html_e( 'Trello Settings', 'astralab' ); ?></h1>
	<form method="post" action="options.php">
		<?php
				settings_fields( 'astralab_trello_group' );
				do_settings_sections( 'astralab-trello' );
				submit_button();
		?>
	</form>

	<hr>

	<h2><?php esc_html_e( 'OAuth Authorization', 'astralab' ); ?></h2>
		<?php if ( $has_token ) : ?>
	<p>Already authorized with Trello.</p>
	<p>OAuth Token: <code><?php echo esc_html( $this->options['oauth_token'] ); ?></code></p>
	<p>OAuth Token Secret: <code><?php echo esc_html( $this->options['oauth_token_secret'] ); ?></code></p>
	<?php else : ?>
	<p>You are not currently connected to Trello. Please click the button below to start the OAuth authorization
		process.</p>
	<form method="post">
		<?php wp_nonce_field( 'trello_oauth_start', 'trello_oauth_nonce' ); ?>
		<input type="hidden" name="trello_oauth_action" value="start" />
		<?php submit_button( 'Connect to Trello', 'primary', 'trello_oauth_start_btn' ); ?>
	</form>
	<?php endif; ?>
</div>
		<?php
	}

	/**
	 * Maybe handle OAuth callback.
	 * If we have ?oauth_verifier in the URL, let's assume it's a Trello callback.
	 */
	public function maybe_handle_oauth_callback() {
		if ( isset( $_GET['page'] ) && $_GET['page'] === 'astralab-trello' && isset( $_GET['oauth_verifier'] ) ) {
			$oauth_verifier = sanitize_text_field( $_GET['oauth_verifier'] );
			// We must have previously stored the request token and secret during initial step
			$request_token        = get_transient( 'trello_request_token' );
			$request_token_secret = get_transient( 'trello_request_token_secret' );

			if ( $request_token && $request_token_secret ) {
				// Exchange request token + verifier for access token
				$access_tokens = $this->get_access_token( $request_token, $request_token_secret, $oauth_verifier );

				if ( ! is_wp_error( $access_tokens ) && isset( $access_tokens['oauth_token'], $access_tokens['oauth_token_secret'] ) ) {
					// Save in options
					$this->options['oauth_token']        = $access_tokens['oauth_token'];
					$this->options['oauth_token_secret'] = $access_tokens['oauth_token_secret'];
					update_option( $this->option_name, $this->options );
					add_action(
						'admin_notices',
						function () {
							echo '<div class="notice notice-success"><p>Successfully connected to Trello!</p></div>';
						}
					);
				} else {
					add_action(
						'admin_notices',
						function () {
							echo '<div class="notice notice-error"><p>Failed to obtain access token from Trello.</p></div>';
						}
					);
				}
			}
		}

		// Handle starting the OAuth process
		if ( isset( $_POST['trello_oauth_action'] ) && $_POST['trello_oauth_action'] === 'start' && check_admin_referer( 'trello_oauth_start', 'trello_oauth_nonce' ) ) {
			$this->start_oauth_flow();
		}
	}

	/**
	 * Start the OAuth flow by obtaining a request token and redirecting the user to Trello.
	 */
	private function start_oauth_flow() {
		$consumer_key    = $this->options['oauth_consumer_key'];
		$consumer_secret = $this->options['oauth_consumer_secret'];

		if ( empty( $consumer_key ) || empty( $consumer_secret ) ) {
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error"><p>Please set your OAuth Consumer Key and Secret first.</p></div>';
				}
			);
			return;
		}

		$response = $this->get_request_token( $consumer_key, $consumer_secret );

		if ( is_wp_error( $response ) ) {
			add_action(
				'admin_notices',
				function () use ( $response ) {
					echo '<div class="notice notice-error"><p>Error getting request token: ' . esc_html( $response->get_error_message() ) . '</p></div>';
				}
			);
			return;
		}

		// Store request token and secret temporarily
		set_transient( 'trello_request_token', $response['oauth_token'], 300 );
		set_transient( 'trello_request_token_secret', $response['oauth_token_secret'], 300 );

		// Redirect user to authorize URL
		$authorize_url = add_query_arg( 'oauth_token', $response['oauth_token'], $this->authorize_url );
		wp_redirect( $authorize_url );
		exit;
	}

	/**
	 * Get request token from Trello.
	 * You must implement the OAuth 1.0 signature, nonce, and parameter logic here.
	 * This is a simplified placeholder.
	 */
	private function get_request_token( $consumer_key, $consumer_secret ) {
		// For OAuth 1.0, you need a signature, nonce, timestamp, etc.
		// The response from Trello will be something like:
		// oauth_token=<token>&oauth_token_secret=<secret>&oauth_callback_confirmed=true

		// Pseudo code (you must properly sign this request):
		$args = array(
			'oauth_consumer_key'     => $consumer_key,
			'oauth_signature_method' => 'HMAC-SHA1',
			'oauth_timestamp'        => time(),
			'oauth_nonce'            => wp_generate_uuid4(),
			'oauth_callback'         => $this->callback_url,
			'oauth_version'          => '1.0',
			// We'll need to generate oauth_signature using consumer_secret
		);

		// Sign and send request:
		// For brevity, we assume a function generate_oauth_signature() exists.
		$args['oauth_signature'] = $this->generate_oauth_signature( 'GET', $this->request_token_url, $args, $consumer_secret, '' );
		$url                     = add_query_arg( $args, $this->request_token_url );

		$response = wp_remote_get( $url );
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$body = wp_remote_retrieve_body( $response );
		parse_str( $body, $parsed );

		if ( empty( $parsed['oauth_token'] ) || empty( $parsed['oauth_token_secret'] ) ) {
			return new \WP_Error( 'trello_oauth_error', 'Invalid request token response from Trello.' );
		}

		return $parsed;
	}

	/**
	 * Exchange request token + verifier for access token.
	 */
	private function get_access_token( $request_token, $request_token_secret, $verifier ) {
		$args = array(
			'oauth_consumer_key'     => $this->options['oauth_consumer_key'],
			'oauth_token'            => $request_token,
			'oauth_verifier'         => $verifier,
			'oauth_signature_method' => 'HMAC-SHA1',
			'oauth_timestamp'        => time(),
			'oauth_nonce'            => wp_generate_uuid4(),
			'oauth_version'          => '1.0',
		);

		$args['oauth_signature'] = $this->generate_oauth_signature( 'GET', $this->access_token_url, $args, $this->options['oauth_consumer_secret'], $request_token_secret );
		$url                     = add_query_arg( $args, $this->access_token_url );

		$response = wp_remote_get( $url );
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$body = wp_remote_retrieve_body( $response );
		parse_str( $body, $parsed );

		if ( empty( $parsed['oauth_token'] ) || empty( $parsed['oauth_token_secret'] ) ) {
			return new \WP_Error( 'trello_oauth_error', 'Invalid access token response from Trello.' );
		}

		return $parsed;
	}

	/**
	 * Generate OAuth Signature (HMAC-SHA1).
	 * This is a placeholder for demonstration. You should properly implement OAuth 1.0 signing here.
	 */
	private function generate_oauth_signature( $method, $url, $params, $consumer_secret, $token_secret ) {
		// Sort parameters
		ksort( $params );
		$base_string = rawurlencode( $method ) . '&' . rawurlencode( $url ) . '&' . rawurlencode( http_build_query( $params, '', '&', PHP_QUERY_RFC3986 ) );
		$signing_key = rawurlencode( $consumer_secret ) . '&' . rawurlencode( $token_secret );

		return base64_encode( hash_hmac( 'sha1', $base_string, $signing_key, true ) );
	}

	/**
	 * Make a signed request to Trello API using OAuth.
	 *
	 * @param string $endpoint Trello API endpoint (e.g., "cards", "boards/<id>", etc.)
	 * @param array  $args     Additional arguments for the request (query or form parameters).
	 * @param string $method   HTTP method: GET or POST (default: GET)
	 * @return array|WP_Error  Response array on success, WP_Error on failure.
	 */
	public function request( $endpoint, $args = array(), $method = 'GET' ) {
		if ( empty( $this->options['oauth_token'] ) || empty( $this->options['oauth_token_secret'] ) ) {
			return new \WP_Error( 'not_authorized', 'Not authorized with Trello via OAuth.' );
		}

		$base_url     = 'https://api.trello.com/1/' . ltrim( $endpoint, '/' );
		$oauth_params = array(
			'oauth_consumer_key'     => $this->options['oauth_consumer_key'],
			'oauth_token'            => $this->options['oauth_token'],
			'oauth_signature_method' => 'HMAC-SHA1',
			'oauth_timestamp'        => time(),
			'oauth_nonce'            => wp_generate_uuid4(),
			'oauth_version'          => '1.0',
		);

		// Combine with user args
		$all_params = array_merge( $oauth_params, $args );

		$oauth_params['oauth_signature'] = $this->generate_oauth_signature( $method, $base_url, $all_params, $this->options['oauth_consumer_secret'], $this->options['oauth_token_secret'] );
		$all_params['oauth_signature']   = $oauth_params['oauth_signature'];

		// For GET, put all params in the query. For POST, put them in the body.
		if ( strtoupper( $method ) === 'GET' ) {
			$url      = add_query_arg( $all_params, $base_url );
			$response = wp_remote_get( $url, array( 'timeout' => 30 ) );
		} else {
			// For POST, we typically put the non-oauth parameters in the body and oauth parameters in the Authorization header.
			// For simplicity, we just put them all in body. For a proper OAuth 1.0 implementation,
			// you'd place OAuth parameters in the Authorization header.
			$response = wp_remote_post(
				$base_url,
				array(
					'timeout' => 30,
					'body'    => $all_params,
				)
			);
		}

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$body    = wp_remote_retrieve_body( $response );
		$decoded = json_decode( $body, true );

		return $decoded ? $decoded : $body;
	}

	/**
	 * Example method to create a new card on Trello using OAuth.
	 */
	public function create_card( $name, $desc = '' ) {
		if ( empty( $this->options['list_id'] ) ) {
			return new \WP_Error( 'no_list_id', 'No list ID is configured.' );
		}

		$args = array(
			'idList' => $this->options['list_id'],
			'name'   => $name,
			'desc'   => $desc,
		);

		return $this->request( 'cards', $args, 'POST' );
	}
}
