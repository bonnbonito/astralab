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
		$trello_api = \ASTRALAB\Trello_API::get_instance();
		$trello_backend = \ASTRALAB\Trello_Backend::get_instance();

		if ( ! $trello_backend && ! $trello_api ) {
			return;
		}

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