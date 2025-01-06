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
		if ( is_user_logged_in() ) :
			wp_enqueue_style( 'astralab/trello' );
			wp_enqueue_script( 'astralab/trello' );
			?>
<div id="orderForm"></div>
<?php
		else :
			?>
<div
  class="flex min-h-[400px] flex-col items-center justify-center space-y-8 p-12 bg-gradient-to-b from-background to-muted/20 rounded-lg shadow-sm">
  <div class="text-center space-y-4">
    <div class="inline-flex p-3 rounded-full bg-primary/10 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="w-6 h-6 text-primary">
        <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"></path>
        <circle cx="16.5" cy="7.5" r=".5"></circle>
      </svg>
    </div>
    <h2 class="text-3xl font-bold tracking-tight">Authentication Required</h2>
    <p class="text-muted-foreground max-w-[500px] mx-auto">Please sign in to access the order form. </p>
  </div>
  <div class="flex flex-col sm:flex-row gap-4">
    <a href="<?php echo wp_login_url( get_permalink() ); ?>"
      class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
      Sign In
    </a>
  </div>
</div>
<?php
		endif;
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