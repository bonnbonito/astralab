<?php

namespace ASTRALAB;

class Dashboard {
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
		//add_filter( 'astralab_localized_scripts', array( $this, 'dashboard' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	public function enqueue_scripts() {
		if ( ! is_page( 'dashboard' ) )
			return;

		wp_enqueue_style( 'astralab/dashboard' );
		wp_enqueue_script( 'astralab/dashboard' );

		wp_localize_script(
			'astralab/dashboard',
			'astralabDashboard',
			array(
				'cards' => $this->dashboard()
			)
		);
	}


	public function dashboard() {
		$args = array(
			'post_type' => 'trello-card',
			'author' => get_current_user_id(),
			'posts_per_page' => -1,
		);

		$query = new \WP_Query( $args );

		if ( ! $query->have_posts() ) {
			return array();
		}

		$dashboard = array_map( function ($post) {
			return array(
				'id' => $post->ID,
				'title' => $post->post_title,
				'content' => $post->post_content,
				'meta' => get_post_meta( $post->ID ),
				'date' => $post->post_date,
				'status' => $post->post_status,
				'date_updated' => $post->post_modified,
				'url' => get_permalink( $post->ID ),
			);
		}, $query->posts );

		return $dashboard;
	}
}