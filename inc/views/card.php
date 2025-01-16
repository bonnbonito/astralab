<div <?php $card_id = get_post_meta( get_the_ID(), 'trello_card_id', true ); ?>>
	<!-- Trello Comment Form -->
	<form id="trello-comment-form" enctype="multipart/form-data" class="mt-20">
		<?php wp_nonce_field( 'trello_form_action', 'trello_form_nonce' ); ?>
		<input type="hidden" name="card_id" value="<?php echo esc_attr( $card_id ); ?>">
		<div class="flex gap-4 items-center">
			<textarea id="card_desc" name="card_desc" class="h-[100px] focus:border focus:border-solid focus:border-black"
				required></textarea>

			<div class="min-w-[300px]">
				<input id="submitBtn" type="submit" value="Send Comment"
					class="w-full text-[#222] uppercase font-semibold text-base">
			</div>
		</div>


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

			echo '<table class="widefat mt-12" style="border:border-collapse: collapse; width:100%;">';
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