<?php

namespace ASTRALAB;

class Trello_Post {
	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;
	/**
	 * Instance Control
	 */

	/**
	 * Option name for Trello settings.
	 *
	 * @var string
	 */
	private $option_name = 'astralab_trello_settings';

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
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		add_action( 'admin_init', array( $this, 'register_trello_settings' ) );

		// Add meta boxes for trello-card
		add_action( 'add_meta_boxes', array( $this, 'add_trello_card_metabox' ) );

		// Hide Kadence Post Meta Section example
		add_filter( 'kadence_classic_meta_box_post_types', array( $this, 'hide_kadence_post_meta_section' ) );
	}

	/**
	 * Add Trello Settings page under "Settings".
	 */
	public function add_options_page() {
		add_options_page(
			'Trello Settings',
			'Trello Settings',
			'manage_options',
			'astralab-trello-settings',
			array( $this, 'render_options_page' )
		);
	}

	/**
	 * Render the options page.
	 */
	public function render_options_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
<div class="wrap">
	<h1>Trello Settings</h1>
	<form method="post" action="options.php">
		<?php
		settings_fields( 'astralab_trello_group' );
		do_settings_sections( 'astralab-trello-settings' );
		submit_button();
		?>
	</form>
</div>
		<?php
	}

	/**
	 * Register Trello Settings and fields.
	 */
	public function register_trello_settings() {
		register_setting(
			'astralab_trello_group',
			$this->option_name,
			array( $this, 'sanitize_settings' )
		);

		add_settings_section(
			'astralab_trello_section',
			'Configure Trello API Credentials',
			null,
			'astralab-trello-settings'
		);

		add_settings_field(
			'trello_api_key',
			'API Key',
			array( $this, 'render_api_key_field' ),
			'astralab-trello-settings',
			'astralab_trello_section'
		);

		add_settings_field(
			'trello_api_token',
			'API Token',
			array( $this, 'render_api_token_field' ),
			'astralab-trello-settings',
			'astralab_trello_section'
		);

		add_settings_field(
			'trello_webhook_callback',
			'Webhook Callback URL',
			array( $this, 'render_webhook_callback_field' ),
			'astralab-trello-settings',
			'astralab_trello_section'
		);
	}

	public function sanitize_settings( $input ) {
		$new_input                            = array();
		$new_input['trello_api_key']          = isset( $input['trello_api_key'] ) ? sanitize_text_field( $input['trello_api_key'] ) : '';
		$new_input['trello_api_token']        = isset( $input['trello_api_token'] ) ? sanitize_text_field( $input['trello_api_token'] ) : '';
		$new_input['trello_webhook_callback'] = isset( $input['trello_webhook_callback'] ) ? esc_url_raw( $input['trello_webhook_callback'] ) : '';

		return $new_input;
	}

	public function render_api_key_field() {
		$options = get_option( $this->option_name );
		$value   = isset( $options['trello_api_key'] ) ? esc_attr( $options['trello_api_key'] ) : '';
		echo "<input type='text' name='{$this->option_name}[trello_api_key]' value='{$value}' class='regular-text' />";
	}

	public function render_api_token_field() {
		$options = get_option( $this->option_name );
		$value   = isset( $options['trello_api_token'] ) ? esc_attr( $options['trello_api_token'] ) : '';
		echo "<input type='text' name='{$this->option_name}[trello_api_token]' value='{$value}' class='regular-text' />";
	}

	public function render_webhook_callback_field() {
		$options = get_option( $this->option_name );
		$value   = isset( $options['trello_webhook_callback'] ) ? esc_url( $options['trello_webhook_callback'] ) : '';
		echo "<input type='url' name='{$this->option_name}[trello_webhook_callback]' value='{$value}' class='regular-text' placeholder='https://example.com/trello-webhook-handler' />";
		echo "<p class='description'>Publicly accessible HTTPS URL for Trello to send webhook events.</p>";
	}

	/**
	 * Add a meta box to display the trello_card_id, message, and attachments
	 */
	public function add_trello_card_metabox() {
		add_meta_box(
			'trello_card_info',
			'Trello Card Info',
			array( $this, 'render_trello_card_metabox' ),
			'trello-card',
			'side',
			'default'
		);

		add_meta_box(
			'trello_card_message',
			'Trello Card Content',
			array( $this, 'render_trello_card_message_metabox' ),
			'trello-card',
			'normal',
			'default'
		);

		add_meta_box(
			'trello_card_activities',
			'Trello Card Activities',
			array( $this, 'render_trello_card_activities_metabox' ),
			'trello-card',
			'normal',
			'default'
		);

		add_meta_box(
			'trello_card_attachments',
			'Trello Card Attachments',
			array( $this, 'render_trello_card_attachments_metabox' ),
			'trello-card',
			'normal',
			'default'
		);

		add_meta_box(
			'trello_card_webhook_id',
			'Trello Card Webhook ID',
			array( $this, 'render_trello_card_webhook_metabox' ),
			'trello-card',
			'normal',
			'default'
		);
	}

	/**
	 * Register the trello-card custom post type.
	 */
	public function register_trello_card_cpt() {
		$labels = array(
			'name'          => 'Trello Cards',
			'singular_name' => 'Trello Card',
		);

		$args = array(
			'labels'              => $labels,
			'public'              => true,
			'publicly_queryable'  => false,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'capability_type'     => 'post',
			'hierarchical'        => false,
			'menu_position'       => 20,
			'menu_icon'           => 'dashicons-index-card',
			'supports'            => array( 'title', 'author' ),
			'has_archive'         => false,
			'exclude_from_search' => true,
			'rewrite'             => false,
		);

		register_post_type( 'trello-card', $args );
	}

	/**
	 * Hide Kadence Post Meta Section example (adjust as needed)
	 */
	public function hide_kadence_post_meta_section( $post_types ) {
		return array( 'test' );
	}

	/**
	 * Render the Trello Card Info meta box.
	 */
	public function render_trello_card_message_metabox( $post ) {
		$trello_card_message = get_post_meta( $post->ID, 'trello_card_message', true );
		if ( ! empty( $trello_card_message ) ) {
			$trello_card_message = nl2br( esc_html( $trello_card_message ) );
			echo '<p><strong>Description:</strong></p>';
			echo '<table class="widefat" style="border:1px solid #ddd; border-collapse: collapse; width:100%;">';
			echo '<tbody>';
			echo '<tr><td><div>';
			echo $trello_card_message;
			echo '</div></td></tr>';
			echo '</tbody>';
			echo '</table>';
		} else {
			echo '<p>No message found.</p>';
		}
	}

	/**
	 * Render the Trello Card Comments meta box.
	 */
	public function render_trello_card_activities_metabox( $post ) {
		$trello_card_activities = get_post_meta( $post->ID, 'trello_card_activities', true );
		$trello_card_id         = get_post_meta( $post->ID, 'trello_card_id', true );

		$upload_dir = wp_upload_dir();
		$trello_dir = trailingslashit( $upload_dir['basedir'] ) . 'trello_actions/';

		$file_path = $trello_dir . $trello_card_id . '.json';

		/** read the file */
		if ( file_exists( $file_path ) ) {
			$file_content = file_get_contents( $file_path );
		}

		if ( ! empty( $file_content ) ) {

			$activities = $this->render_trello_timeline( $file_content );

			echo '<table class="widefat" style="border:1px solid #ddd; border-collapse: collapse; width:100%;">';
			echo '<tbody>';
			echo '<tr><td><div>';
			echo $activities;
			echo '</div></td></tr>';
			echo '</tbody>';
			echo '</table>';
		} else {
			echo '<p>No activities found.</p>';
		}
	}


	public function render_trello_card_metabox( $post ) {
		$trello_card_id = get_post_meta( $post->ID, 'trello_card_id', true );
		if ( ! empty( $trello_card_id ) ) {
			echo '<p><strong>Trello Card ID:</strong> ' . esc_html( $trello_card_id ) . '</p>';

			$trello_webhook_id = get_post_meta( $post->ID, 'trello_webhook_id', true );
			if ( ! empty( $trello_webhook_id ) ) {
				echo '<p><strong>Webhook ID:</strong> ' . esc_html( $trello_webhook_id ) . '</p>';
			}
		} else {
			echo '<p>No Trello Card ID found.</p>';
		}
	}

	public function render_trello_card_attachments_metabox( $post ) {
		$trello_card_attachments = get_post_meta( $post->ID, 'trello_card_attachments', true );

		if ( ! empty( $trello_card_attachments ) ) {
			echo '<p><strong>Attachments:</strong></p>';
			echo '<table class="widefat" style="border:1px solid #ddd; border-collapse: collapse; width:100%;">';
			echo '<tbody>';
			foreach ( $trello_card_attachments as $attachment ) {
				echo '<tr><td><div>';
				echo '<a href="' . esc_url( $attachment['url'] ) . '" target="_blank">' . esc_html( $attachment['name'] ) . '</a>';
				echo '</div></td></tr>';
			}
			echo '</tbody>';
			echo '</table>';
		} else {
			echo '<p>No attachments found.</p>';
		}
	}

	public function render_trello_card_webhook_metabox( $post ) {
		$trello_webhook_id = get_post_meta( $post->ID, 'trello_webhook_id', true );
		if ( ! empty( $trello_webhook_id ) ) {
			echo '<p><strong>Webhook ID:</strong> ' . esc_html( $trello_webhook_id ) . '</p>';
		} else {
			echo '<p>No webhook ID found.</p>';
		}
	}

	public function render_trello_timeline( $json_data ) {
		// Decode the JSON string into a PHP array
		$data = json_decode( $json_data, true );

		// Start building the timeline HTML
		$html = '<div class="trello_timeline space-y-4">';
		foreach ( $data as $event ) {
			$event_date   = date( 'F j, Y, g:i a', strtotime( $event['date'] ) );
			$event_type   = ucfirst( $event['type'] );
			$member_name  = htmlspecialchars( $event['memberCreator']['fullName'] ?? 'Unknown' );
			$card_name    = htmlspecialchars( $event['data']['card']['name'] ?? 'Unnamed Card' );
			$list_before  = $event['data']['listBefore']['name'] ?? null;
			$list_after   = $event['data']['listAfter']['name'] ?? null;
			$comment_text = $event['data']['text'] ?? null;
			$is_reply     = $event['appCreator'] ?? null;
			if ( null !== $comment_text ) {
				$comment_text = str_replace( '# **Reply:**', '', $comment_text );
				$comment_text = $this->convert_trello_markup_to_html( $comment_text );
			}

			// Start event block
			$html .= '<div class="bg-white shadow-md border border-gray-200 rounded-lg p-4">';
			$html .= '<div class="text-gray-600 text-sm mb-2">' . $event_date . '</div>';
			$html .= '<div class="text-lg font-bold text-gray-800">' . $event_type . '</div>';

			// Add type-specific details
			if ( $list_before && $list_after ) {
				$html .= '<div class="mt-2">';
				$html .= '<span class="text-gray-700 font-semibold">Moved from:</span> ';
				$html .= '<span class="text-gray-800">' . htmlspecialchars( $list_before ) . '</span> ';
				$html .= '<span class="text-gray-700 font-semibold">to</span> ';
				$html .= '<span class="text-gray-800">' . htmlspecialchars( $list_after ) . '</span>';
				$html .= '</div>';
			} elseif ( $comment_text ) {
				$html .= '<div class="mt-2">';
				if ( $is_reply ) {
					$html .= '<span class="text-green-600 font-semibold">Client Reply:</span><br>';
				} else {
					$html .= '<span class="text-blue-600 font-semibold">Comment:</span><br>';
				}
				$html .= '<div class="mt-1 text-gray-800">' . wp_kses_post( $comment_text ) . '</div>';
				$html .= '</div>';
			}

			$html .= '</div>';
		}
		$html .= '</div>';

		return $html;
	}


	public function convert_trello_markup_to_html( $trello_markup ) {
		// Ensure Parsedown is included
		// If using Composer's autoload, make sure to include it:
		// require __DIR__ . '/vendor/autoload.php';

		$parsedown = new \Parsedown();
		// Enable GitHub-Flavored Markdown features if needed
		// $parsedown->setBreaksEnabled(true); // For line breaks without two spaces
		// $parsedown->setUrlsLinked(true);    // Make links clickable

		// Convert the Trello markup (Markdown) to HTML
		$html = $parsedown->text( $trello_markup );

		return $html;
	}

	public function convert_html_to_trello_markup( $html ) {
		$search = array(
			// Headings
			'/<h1>(.*?)<\/h1>/i',
			'/<h2>(.*?)<\/h2>/i',
			'/<h3>(.*?)<\/h3>/i',

			// Bold and Italic
			'/<strong>(.*?)<\/strong>/i',
			'/<b>(.*?)<\/b>/i',
			'/<em>(.*?)<\/em>/i',
			'/<i>(.*?)<\/i>/i',

			// Links
			'/<a href="(.*?)">(.*?)<\/a>/i',

			// Unordered Lists
			'/<ul>(.*?)<\/ul>/is',
			'/<li>(.*?)<\/li>/i',

			// Ordered Lists
			'/<ol>(.*?)<\/ol>/is',
			'/<li>(.*?)<\/li>/i',

			// Paragraphs
			'/<p>(.*?)<\/p>/i',

			// Line Breaks
			'/<br\s*\/?>/i',
		);

		$replace = array(
			// Headings
			'# $1',
			'## $1',
			'### $1',

			// Bold and Italic
			'**$1**',
			'**$1**',
			'_$1_',
			'_$1_',

			// Links
			'[$2]($1)',

			// Unordered Lists
			"\n$1\n",
			'- $1',

			// Ordered Lists
			"\n$1\n",
			'1. $1',

			// Paragraphs
			"\n$1\n",

			// Line Breaks
			"\n",
		);

		// Remove all other HTML tags
		$html = preg_replace( $search, $replace, $html );
		$html = strip_tags( $html );

		return trim( $html );
	}
}
