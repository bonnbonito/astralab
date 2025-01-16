<?php
namespace ASTRALAB;

/**
 * Scripts Class
 */
class Scripts {
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
		add_action( 'init', array( $this, 'init' ), 1 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		//add_filter( 'kadence_css_files', array( $this, 'kadence_css_files' ) );
	}

	/**
	 * Unset content.min.css
	 *
	 * @param array $files Array of CSS files to enqueue.
	 * @return array Modified array of CSS files to enqueue.
	 */
	public function kadence_css_files( $css ) {
		//unset( $css['kadence-content'] );
		return $css;
	}

	/**
	 * Register scripts and stylesheets.
	 */
	public function init() {

		$asset_url = ASTRALAB_DIR_URI . '/assets/build/';
		$asset_dir = ASTRALAB_DIR_PATH . '/assets/build/';

		$asset_files = glob( $asset_dir . '*.asset.php' );

		foreach ( $asset_files as $asset_file ) {

			$asset_script = require $asset_file;

			$asset_filename = basename( $asset_file );

			$asset_parts = explode( '.asset.php', $asset_filename );
			$asset_slug = array_shift( $asset_parts );

			$asset_handle = sprintf( 'astralab/%s', $asset_slug );

			if ( 'main' === $asset_slug ) {
				$stylesheet_path = $asset_dir . $asset_slug . '.css';
				$stylesheet_url = $asset_url . $asset_slug . '.css';
			} else {
				$stylesheet_path = $asset_dir . 'style-' . $asset_slug . '.css';
				$stylesheet_url = $asset_url . 'style-' . $asset_slug . '.css';
			}

			if ( true === is_readable( $stylesheet_path ) ) {

				wp_register_style(
					$asset_handle,
					$stylesheet_url,
					array(),
					$asset_script['version']
				);
			}

			$javascript_path = $asset_dir . $asset_slug . '.js';
			$javascript_url = $asset_url . $asset_slug . '.js';

			if ( true === is_readable( $javascript_path ) ) {
				wp_register_script(
					$asset_handle,
					$javascript_url,
					$asset_script['dependencies'],
					$asset_script['version'],
					true
				);
			}
		}
	}

	/**
	 * Enqueue scripts and stylesheets.
	 */
	public function enqueue_scripts() {
		wp_enqueue_style( 'astralab/main' );
		wp_enqueue_script( 'astralab/main' );

		wp_localize_script(
			'astralab/trello',
			'astralab',
			apply_filters( 'astralab_localized_scripts', array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( 'astralab_nonce' ),
				'options' => rest_url() . 'astralab/v1/options',
				'product-types' => rest_url() . 'wp/v2/product-type'
			) )
		);
	}
}