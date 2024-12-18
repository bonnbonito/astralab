<?php
/**
 * Autoloader for theme
 */

function autoloader( $class ) {
	// Replace namespace separator with directory separator

	$namespace = 'ASTRALAB';

	if ( strpos( $class, $namespace ) !== 0 ) {
		return false;
	}

	$class = str_replace( $namespace . '\\', '', $class );

	// lowercase the class name
	$class = strtolower( $class );

	// Replace _ to -
	$class = str_replace( '_', '-', $class );

	// Construct the full path to the class file
	$class_path = ASTRALAB_CLASS_PATH . '/class-' . $class . '.php';

	// Check if the file exists before including
	if ( file_exists( $class_path ) ) {
		require $class_path;
	}
}

spl_autoload_register( 'autoloader' );

$instances = array(
	'Scripts',
	'Trello_Post',
	'Trello_Frontend',
	'Trello_Backend',
	'Trello_API',
	'Users',
	'Shortcodes',
);

foreach ( $instances as $instance ) {
	$class = "ASTRALAB\\$instance";
	$class::get_instance();
}
