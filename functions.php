<?php
/**
 * Theme Functions.
 *
 * @package Nova B2B
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
	function ( $exclude_filters ) {
		$exclude_filters[] = '/node_modules';
		return $exclude_filters;
	}
);

$astralab->setBranch( 'master' );

/**
 * Enqueue child styles.
 */
function child_enqueue_styles() {
	wp_enqueue_style( 'child-theme', get_stylesheet_directory_uri() . '/style.css', array(), 100 );
}

// add_action( 'wp_enqueue_scripts', 'child_enqueue_styles' ); // Remove the // from the beginning of this line if you want the child theme style.css file to load on the front end of your site.

/**
 * Add custom functions here
 */
