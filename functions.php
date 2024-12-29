<?php
/**
 * Theme Functions.
 *
 * @package ASTRALAB B2B
 */

// require_once get_stylesheet_directory() . '/vendor/autoload.php';
require get_stylesheet_directory() . '/bonn-update-checker/plugin-update-checker.php';

$namespace = 'ASTRALAB';

use Bonn\PluginUpdateChecker\v5\PucFactory;

$astralab = PucFactory::buildUpdateChecker(
	'https://github.com/bonnbonito/astralab/',
	__FILE__,
	'astralab'
);

add_filter(
	'ai1wm_exclude_themes_from_export',
	function ($exclude_filters) {
		$exclude_filters[] = '/node_modules';
		return $exclude_filters;
	}
);

$astralab->setBranch( 'master' );

/**
 * Enqueue child styles.
 */
function child_enqueue_styles() {
	wp_enqueue_style( 'astralab-theme', get_stylesheet_directory_uri() . '/style.css', array(), 100 );
}

// add_action( 'wp_enqueue_scripts', 'child_enqueue_styles' ); // Remove the // from the beginning of this line if you want the child theme style.css file to load on the front end of your site.

/**
 * Add custom functions here
 */

if ( ! defined( 'ASTRALAB_DIR_PATH' ) ) {
	define( 'ASTRALAB_DIR_PATH', untrailingslashit( get_stylesheet_directory() ) );
}

if ( ! defined( 'ASTRALAB_CLASS_PATH' ) ) {
	define( 'ASTRALAB_CLASS_PATH', untrailingslashit( get_stylesheet_directory() . '/inc/class' ) );
}

if ( ! defined( 'ASTRALAB_DIR_URI' ) ) {
	define( 'ASTRALAB_DIR_URI', untrailingslashit( get_stylesheet_directory_uri() ) );
}

if ( ! defined( 'ASTRALAB_ARCHIVE_POST_PER_PAGE' ) ) {
	define( 'ASTRALAB_ARCHIVE_POST_PER_PAGE', 9 );
}

// add Parsedown.ph
require ASTRALAB_DIR_PATH . '/inc/Parsedown.php';

require ASTRALAB_DIR_PATH . '/inc/autoloader.php';


function convert_trello_markup_to_html( $trello_markup ) {
	// Ensure Parsedown is included
	// If using Composer's autoload, make sure to include it:
	// require __DIR__ . '/vendor/autoload.php';

	$parsedown = new Parsedown();
	// Enable GitHub-Flavored Markdown features if needed
	// $parsedown->setBreaksEnabled(true); // For line breaks without two spaces
	// $parsedown->setUrlsLinked(true);    // Make links clickable

	// Convert the Trello markup (Markdown) to HTML
	$html = $parsedown->text( $trello_markup );

	return $html;
}

function modify_rest_featured_media() {
	register_rest_field(
		'product-type', // The post type (e.g., 'post', 'product', etc.)
		'featured_media_url', // The new field name
		array(
			'get_callback' => function ($object) {
				$media_id = $object['featured_media'];
				if ( $media_id ) {
					return wp_get_attachment_url( $media_id );
				}
				return null;
			},
			'update_callback' => null, // Optional: If you want to make it writable
			'schema' => array(
				'description' => 'The URL of the featured media.',
				'type' => 'string',
				'context' => array( 'view', 'edit' ),
			),
		)
	);
}
add_action( 'rest_api_init', 'modify_rest_featured_media' );