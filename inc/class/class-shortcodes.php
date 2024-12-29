<?php

namespace ASTRALAB;

class Shortcodes {
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
		add_shortcode( 'astralab_dashboard', array( $this, 'astralab_dashboard_shortcode' ) );
		add_shortcode( 'order_form', array( $this, 'order_form_shortcode' ) );
	}

	/**
	 * Summary of order_form_shortcode
	 * @param mixed $atts
	 * @return bool|string
	 */
	public function order_form_shortcode() {

		ob_start();
		wp_enqueue_style( 'astralab/trello' );
		wp_enqueue_script( 'astralab/trello' );
		?>
		<div id="orderForm"></div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Astralab Dashboard Shortcode
	 *
	 * @param array $atts
	 *
	 * @return string
	 */
	public function astralab_dashboard_shortcode( $atts ) {
		ob_start();
		include_once ASTRALAB_DIR_PATH . '/inc/views/dashboard.php';
		$output = ob_get_clean();
		return $output;
	}
}