<?php

namespace ASTRALAB;

class Single_Card {
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
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		add_action( 'kadence_single_after_inner_content', array( $this, 'show_trello_card_details' ) );
		add_action( 'kadence_single_after_inner_content', array( $this, 'show_trello_old_comment' ), 20 );

		add_action( 'kadence_single_before_inner_content', array( $this, 'single_card_title' ) );
		add_shortcode( 'trello_client_name', array( $this, 'trello_client_name' ) );

		add_action( 'template_redirect', array( $this, 'trello_card_redirect' ) );
	}

	public function trello_card_redirect() {
		// Early return if not on a single trello card page
		if ( ! is_singular( 'trello-card' ) ) {
			return;
		}

		$post = get_post();

		// Verify post exists and is the correct type
		if ( ! $post || 'trello-card' !== $post->post_type ) {
			wp_safe_redirect( home_url( '/dashboard' ) );
			exit;
		}

		$current_user_id = get_current_user_id();

		// Check if user is author or admin
		if ( $current_user_id !== (int) $post->post_author && ! current_user_can( 'administrator' ) ) {
			wp_safe_redirect( home_url( '/dashboard' ) );
			exit;
		}
	}

	public function show_trello_card_details() {
		if ( ! is_singular( 'trello-card' ) )
			return;

		$this->get_trello_details();
	}

	public function trello_client_name() {
		ob_start();
		$this->get_trello_title();
		return ob_get_clean();
	}

	/**
	 * Shortcode function
	 * @return void
	 */
	public function single_card_title() {
		if ( ! is_singular( 'trello-card' ) )
			return;

		$this->get_trello_title();
	}

	public function get_trello_title() {
		echo get_template_part( 'inc/views/card-title' );
	}
	public function get_trello_details() {
		echo get_template_part( 'inc/views/card-details' );
	}

	/**
	 * Summary of show_trello_old_comment
	 * @return void
	 */
	public function show_trello_old_comment() {
		if ( ! is_singular( 'trello-card' ) )
			return;
		get_template_part( 'inc/views/card' );
	}

	/**
	 * Summary of enqueue_scripts
	 * @return void
	 */
	public function enqueue_scripts() {
		if ( ! is_singular( 'trello-card' ) )
			return;

		wp_enqueue_style( 'astralab/single-card' );
		wp_enqueue_script( 'astralab/single-card' );

		wp_localize_script(
			'astralab/single-card',
			'astralabSingleCard',
			array(
				'cards' => $this->get_trello_card()
			)
		);
	}


	public function get_trello_card() {
		$args = array(
			'post_type' => 'trello-card',
			'p' => get_the_ID(),
		);

		$query = new \WP_Query( $args );

		if ( ! $query->have_posts() ) {
			return array();
		}



		$dashboard = array_map( function ($post) {
			$upload_dir = wp_upload_dir();

			$trello_dir = trailingslashit( $upload_dir['basedir'] ) . 'trello_actions/';

			$trello_card_id = get_post_meta( $post->ID, 'trello_card_id', true );

			$file_path = $trello_dir . $trello_card_id . '.json';

			$trello_card_message = get_post_meta( $post->ID, 'trello_card_message', true );
			return array(
				'id' => $post->ID,
				'title' => $post->post_title,
				'content' => $post->post_content,
				'activites' => get_post_meta( $post->ID, 'trello_card_activities', true ),
				'trello_id' => $trello_card_id,
				'json_file' => $file_path,
				'date' => $post->post_date,
				'status' => $post->post_status,
				'date_updated' => $post->post_modified,
				'message' => $trello_card_message,
				'url' => get_permalink( $post->ID ),
			);
		}, $query->posts );

		return $dashboard[0];
	}
}