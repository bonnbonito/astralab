<?php

namespace ASTRALAB;

class Trello_API {
	/**
	 * Instance of this class
	 *
	 * @var null|self
	 */
	private static $instance = null;

	/**
	 * Option name for Trello settings.
	 *
	 * @var string
	 */
	private $option_name = 'astralab_trello_settings';

	/**
	 * Get the singleton instance of this class.
	 *
	 * @return self
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
	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_trello_webhook_endpoint' ) );
	}

	/**
	 * Register REST API endpoints for Trello webhook.
	 */
	public function register_trello_webhook_endpoint() {
		register_rest_route(
			'astralab/v1',
			'/trello-webhook',
			array(
				'methods' => \WP_REST_Server::ALLMETHODS,
				'callback' => array( $this, 'handle_trello_webhook' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Handle Trello webhook requests.
	 *
	 * @param \WP_REST_Request $request REST API request.
	 * @return \WP_REST_Response
	 */
	public function handle_trello_webhook( $request ) {
		if ( $request->get_method() === 'HEAD' ) {
			// Handle webhook verification request.
			return new \WP_REST_Response( null, 200 );
		}

		$body = $request->get_body();
		$data = json_decode( $body, true );

		if ( empty( $data ) || ! isset( $data['webhook']['idModel'] ) ) {
			error_log( 'Invalid Trello webhook payload received.' );
			return new \WP_REST_Response(
				array(
					'status' => 'error',
					'message' => 'Invalid payload',
				),
				400
			);
		}

		$card_id = sanitize_text_field( $data['webhook']['idModel'] );

		$options = get_option( $this->option_name );
		$api_key = $options['trello_api_key'] ?? '';
		$api_token = $options['trello_api_token'] ?? '';

		if ( empty( $api_key ) || empty( $api_token ) ) {
			error_log( 'Missing Trello API credentials.' );
			return new \WP_REST_Response(
				array(
					'status' => 'error',
					'message' => 'Missing Trello API credentials',
				),
				500
			);
		}

		// Fetch existing Trello card post.
		$post_id = $this->get_post_id_by_meta( 'trello_card_id', $card_id );

		if ( ! $post_id ) {
			error_log( "Trello card with ID {$card_id} does not exist." );
			return new \WP_REST_Response(
				array(
					'status' => 'error',
					'message' => 'Card does not exist',
				),
				404
			);
		}

		// Fetch Trello card actions.
		$response = $this->trello_api_request( 'GET', "cards/{$card_id}/actions" );

		if ( is_wp_error( $response ) ) {
			error_log( 'Error retrieving Trello card actions: ' . $response->get_error_message() );
			return new \WP_REST_Response(
				array(
					'status' => 'error',
					'message' => 'Error retrieving card actions',
				),
				500
			);
		}

		// Save actions to post meta and file.
		update_post_meta( $post_id, 'trello_card_activities', wp_json_encode( $response, JSON_UNESCAPED_SLASHES ) );
		$this->save_trello_actions_to_file( $card_id, $response );

		return new \WP_REST_Response(
			array(
				'status' => 'ok',
				'message' => 'Webhook processed successfully',
			),
			200
		);
	}

	/**
	 * Fetch a post ID by a specific meta key and value.
	 *
	 * @param string $meta_key   The meta key.
	 * @param string $meta_value The meta value.
	 * @return int|null The post ID, or null if not found.
	 */
	private function get_post_id_by_meta( $meta_key, $meta_value ) {
		$query = new \WP_Query(
			array(
				'post_type' => 'trello-card',
				'meta_query' => array(
					array(
						'key' => $meta_key,
						'value' => $meta_value,
					),
				),
				'posts_per_page' => 1,
				'post_status' => 'publish',
			)
		);

		return $query->have_posts() ? $query->posts[0]->ID : null;
	}

	/**
	 * Save Trello actions to a JSON file.
	 *
	 * @param string $card_id The Trello card ID.
	 * @param array  $actions The actions data.
	 */
	private function save_trello_actions_to_file( $card_id, $actions ) {
		// Initialize the WordPress filesystem
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		global $wp_filesystem;
		WP_Filesystem();

		$upload_dir = wp_upload_dir();
		$trello_dir = trailingslashit( $upload_dir['basedir'] ) . 'trello_actions/';

		// Ensure the directory exists
		if ( ! $wp_filesystem->is_dir( $trello_dir ) ) {
			if ( ! $wp_filesystem->mkdir( $trello_dir, FS_CHMOD_DIR ) ) {
				error_log( "Failed to create directory: {$trello_dir}" );
				return;
			}
		}

		$file_path = trailingslashit( $trello_dir ) . $card_id . '.json';

		// Save the JSON content to the file
		$file_content = wp_json_encode( $actions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );

		if ( ! $wp_filesystem->put_contents( $file_path, $file_content, FS_CHMOD_FILE ) ) {
			error_log( "Failed to save Trello actions to file: {$file_path}" );
		}
	}


	/**
	 * Handles Trello API requests.
	 *
	 * @param string $method The HTTP method ('GET' or 'POST').
	 * @param string $endpoint The API endpoint (e.g., 'cards/{id}/actions').
	 * @param array  $params Query parameters or body data for the request.
	 * @param array  $headers Optional. Additional headers for the request.
	 * @return array|\WP_Error The API response as an associative array or WP_Error on failure.
	 */
	public function trello_api_request( $method, $endpoint, $params = array(), $headers = array() ) {
		$options = get_option( $this->option_name );
		$api_key = $options['trello_api_key'] ?? '';
		$api_token = $options['trello_api_token'] ?? '';

		if ( empty( $api_key ) || empty( $api_token ) ) {
			return new \WP_Error( 'missing_credentials', 'Trello API credentials are not configured.' );
		}

		$base_url = 'https://api.trello.com/1/';
		$url = trailingslashit( $base_url ) . $endpoint;

		$params['key'] = $api_key;
		$params['token'] = $api_token;

		$args = array(
			'headers' => $headers,
		);

		if ( strtoupper( $method ) === 'GET' ) {
			$url = add_query_arg( $params, $url );
		} elseif ( strtoupper( $method ) === 'POST' ) {
			$args['body'] = $params;
		} else {
			return new \WP_Error( 'invalid_method', 'Invalid HTTP method. Only GET and POST are supported.' );
		}

		$response = strtoupper( $method ) === 'GET' ? wp_remote_get( $url, $args ) : wp_remote_post( $url, $args );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( $response_code < 200 || $response_code >= 300 ) {
			return new \WP_Error( 'api_error', 'Trello API error.', $response_body );
		}

		return $response_body;
	}
}