<?php
/**
 * Template part for displaying a post or page.
 *
 * @package kadence
 */

namespace Kadence;

?>
<?php
if ( kadence()->show_feature_above() ) {
	get_template_part( 'template-parts/content/entry_thumbnail', get_post_type() );
}
?>
<article id="post-<?php the_ID(); ?>"
    <?php post_class( 'entry content-bg single-entry' . ( kadence()->option( 'post_footer_area_boxed' ) ? ' post-footer-area-boxed' : '' ) ); ?>>
    <div class="entry-content-wrap">
        <?php
		do_action( 'kadence_single_before_inner_content' );

		if ( kadence()->show_in_content_title() ) {
			get_template_part( 'template-parts/content/entry_header', get_post_type() );
		}

		$card_id = get_post_meta( get_the_ID(), 'trello_card_id', true );
		?>

        <!-- Trello Comment Form -->
        <form id="trello-comment-form" enctype="multipart/form-data">
            <?php wp_nonce_field( 'trello_form_action', 'trello_form_nonce' ); ?>

            <label for="card_desc">Comment:</label><br>
            <textarea id="card_desc" name="card_desc"></textarea>
            <input type="hidden" name="card_id" value="<?php echo esc_attr( $card_id ); ?>">

            <input type="submit" value="Send Comment">
        </form>
        <div id="trello-comment-response"></div>


        <?php



		$upload_dir = wp_upload_dir();
		$trello_dir = trailingslashit( $upload_dir['basedir'] ) . 'trello_actions/';

		$file_path = $trello_dir . $card_id . '.json';

		// Initialize the WordPress filesystem
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		global $wp_filesystem;
		if ( WP_Filesystem() ) {
			// Check if the file exists and read its content
			if ( $wp_filesystem->exists( $file_path ) ) {
				$file_content = $wp_filesystem->get_contents( $file_path );
			} else {
				$file_content = false; // Handle file not found
			}
		} else {
			// Handle error initializing WP_Filesystem
			$file_content = false;
		}

		if ( ! empty( $file_content ) ) {

			$trello_post = \ASTRALAB\Trello_Post::get_instance();

			if ( $trello_post ) {

				$activities = $trello_post->render_trello_timeline( $file_content );

				echo '<table class="widefat" style="border:1px solid #ddd; border-collapse: collapse; width:100%;">';
				echo '<tbody>';
				echo '<tr><td><div>';
				echo $activities;
				echo '</div></td></tr>';
				echo '</tbody>';
				echo '</table>';
			}
		} else {
			echo '<p>No activities found.</p>';
		}



		do_action( 'kadence_single_after_inner_content' );
		?>
    </div>
</article><!-- #post-<?php the_ID(); ?> -->

<?php
/**
 * Hook for anything after single content
 */
do_action( 'kadence_single_after_content' );

if ( is_singular( get_post_type() ) ) {
	if ( 'post' === get_post_type() && kadence()->option( 'post_author_box' ) ) {
		get_template_part( 'template-parts/content/entry_author', get_post_type() );
	}
	// Show post navigation only when the post type is 'post' or has an archive.
	if ( ( 'post' === get_post_type() || get_post_type_object( get_post_type() )->has_archive ) && kadence()->show_post_navigation() ) {
		if ( kadence()->option( 'post_footer_area_boxed' ) ) {
			echo '<div class="post-navigation-wrap content-bg entry-content-wrap entry">';
		}
		the_post_navigation(
			apply_filters(
				'kadence_post_navigation_args',
				array(
					'prev_text' => '<div class="post-navigation-sub"><small>' . kadence()->get_icon( 'arrow-left-alt' ) . esc_html__( 'Previous', 'kadence' ) . '</small></div>%title',
					'next_text' => '<div class="post-navigation-sub"><small>' . esc_html__( 'Next', 'kadence' ) . kadence()->get_icon( 'arrow-right-alt' ) . '</small></div>%title',
				)
			)
		);
		if ( kadence()->option( 'post_footer_area_boxed' ) ) {
			echo '</div>';
		}
	}
	if ( 'post' === get_post_type() && kadence()->option( 'post_related' ) ) {
		get_template_part( 'template-parts/content/entry_related', get_post_type() );
	}
	// Show comments only when the post type supports it and when comments are open or at least one comment exists.
	if ( kadence()->show_comments() ) {
		comments_template();
	}
}