<?php
$post_id = get_the_ID();
$trello_message = get_post_meta( $post_id, 'trello_card_message', true );
$trello_card_attachments = get_post_meta( $post_id, 'trello_card_attachments', true );

$trello_project_name = get_post_meta( $post_id, 'trello_project_name', true );
$trello_turnaround_time = get_post_meta( $post_id, 'trello_turnaround_time', true );
$trello_design_details = get_post_meta( $post_id, 'trello_design_details', true );
$trello_product_description = get_post_meta( $post_id, 'trello_product_description', true );
$trello_layout_type = get_post_meta( $post_id, 'trello_layout_type', true );
$product_ada = get_post_meta( $post_id, 'product_ada', true );
$product_monuments = get_post_meta( $post_id, 'product_monuments', true );

$fileSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
  <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clip-rule="evenodd" />
</svg>';

$attachments = [];
if ( $trello_card_attachments ) {
	foreach ( $trello_card_attachments as $attachment ) {
		$attachments[] = '<a class="text-sm rounded border border-gray-300 p-2 flex items-center gap-2 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300" href="' . $attachment['url'] . '" target="_blank">' . $fileSvg . $attachment['name'] . '</a>';
	}
}

function output_array( $array ) {
	if ( is_array( $array ) ) {
		return implode( ', ', $array );
	}
	return $array;
}

/**
 * Process and display design inspirations consistently
 * 
 * @param array|string $design_inspirations The raw design inspirations data
 * @return string HTML output of design inspirations
 */
function get_design_inspirations( $design_inspirations ) {
	$designs = [];

	if ( empty( $design_inspirations ) ) {
		return '';
	}

	// Parse JSON if it's a string
	if ( is_string( $design_inspirations ) ) {
		$inspirations = json_decode( stripslashes( $design_inspirations ), true );
	} else {
		$inspirations = $design_inspirations;
	}

	// Process inspirations
	if ( is_array( $inspirations ) ) {
		foreach ( $inspirations as $inspiration ) {
			if ( isset( $inspiration['url'] ) && isset( $inspiration['title'] ) ) {
				$designs[] = [ 
					'url' => $inspiration['url'],
					'title' => $inspiration['title'],
				];
			}
		}
	}

	// Generate HTML output
	$output = '';
	if ( ! empty( $designs ) ) {
		$output .= '<div class="grid grid-cols-3 gap-2">';
		foreach ( $designs as $design ) {
			$output .= '<div class="w-[150px] p-2 border rounded">';
			$output .= '<img src="' . esc_url( $design['url'] ) . '" alt="' . esc_attr( $design['title'] ) . '" class="">';
			$output .= '<div class="text-xs">' . esc_html( $design['title'] ) . '</div>';
			$output .= '</div>';
		}
		$output .= '</div>';
	}

	return $output;
}

?>
<div class="mt-8">
	<div class="flex gap-4">
		<div>
			<h2 class="uppercase mb-0 pb-0">PROJECT NAME:</h2>
			<p class="uppercase text-lg"><?php echo get_the_title(); ?></p>


			<div class="mt-4 mb-10">
				<div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1">
					<div class="font-semibold">TURNAROUND TIME</div>
					<div><?php echo $trello_turnaround_time; ?></div>
					<div class="font-semibold">DESIGN DETAILS</div>
					<div><?php echo $trello_design_details; ?></div>
					<div class="font-semibold">PROJECT DESCRIPTION</div>
					<div><?php echo $trello_product_description; ?></div>
					<div class="font-semibold">LAYOUT TYPE</div>
					<div><?php echo $trello_layout_type; ?></div>
					<div class="font-semibold">UPLOADS</div>
					<div class="flex flex-wrap gap-2"><?php echo output_array( $attachments ); ?></div>
				</div>
			</div>

			<h3 class="uppercase">PRODUCT TYPES:</h3>

			<div class="grid grid-cols-1 gap-y-10 mt-4">

				<?php $ada = get_post_meta( $post_id, 'product_ada', true );

				if ( $ada ) :

					?>
					<div class="mt-8">
						<p class="uppercase text-lg mb-3">ADA WAYFINDING</p>
						<div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1 *:py-2">
							<div class="font-semibold">NUMBER OF SIGNS</div>
							<div><?php echo $ada['numberOfSigns']; ?></div>
							<?php
							$ada_signs_json = $ada['signs'];
							$ada_signs = json_decode( stripslashes( $ada_signs_json ), true );
							?>
							<?php foreach ( $ada_signs as $index => $sign ) : ?>
								<div class="font-semibold pl-2">NO.<?php echo $index + 1; ?> NAME</div>
								<div><?php echo $sign['name']; ?></div>
								<div class="font-semibold pl-2">NO.<?php echo $index + 1; ?> DIMENSION</div>
								<div><?php echo $sign['dimension']; ?></div>
								<div class="font-semibold pl-2">NO.<?php echo $index + 1; ?> DETAILS</div>
								<div><?php echo $sign['details']; ?></div>
							<?php endforeach; ?>
							<div class="font-semibold">TYPES</div>
							<div>
								<?php echo is_array( $ada['types'] ) ? implode( ', ', $ada['types'] ) : $ada['types']; ?>
							</div>
							<div class="font-semibold">DESIGN INSPIRATIONS</div>
							<div>
								<?php echo get_design_inspirations( $ada['designInspirations'] ); ?>
							</div>
						</div>
					<?php endif;

				$monuments = get_post_meta( $post_id, 'product_monuments', true );

				if ( $monuments ) :
					?>

						<div class="mt-8">
							<p class="uppercase text-lg mb-3">MONUMENTS & PYLONS</p>
							<div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1">
								<div class="font-semibold">NUMBER OF SIGNS</div>
								<div><?php echo $monuments['numberOfSigns']; ?></div>
								<div class="font-semibold">SIGN TEXT & CONTEXT</div>
								<div><?php echo $monuments['textAndContent']; ?></div>
								<div class="font-semibold">SIDES</div>
								<div><?php echo $monuments['sides']; ?></div>
								<div class="font-semibold">DIMENSIONS</div>
								<div><?php echo $monuments['dimensions']; ?></div>
								<div class="font-semibold">MAX CONTENT AREA</div>
								<div><?php echo $monuments['maxContentArea']; ?></div>
								<div class="font-semibold">MIN CONTENT AREA</div>
								<div><?php echo $monuments['minContentArea']; ?></div>
								<div class="font-semibold">MAX GROUND CLEARANCE</div>
								<div><?php echo $monuments['maxGroundClearance']; ?></div>
								<div class="font-semibold">TYPES</div>
								<div><?php echo output_array( $monuments['types'] ); ?></div>
								<div class="font-semibold">ILLUMINATION</div>
								<div><?php echo output_array( $monuments['illumination'] ); ?></div>
								<div class="font-semibold">DESIGN INSPIRATIONS</div>
								<div>
									<?php echo get_design_inspirations( $monuments['designInspirations'] ); ?>
								</div>
							</div>
						</div>

						<?php
				endif;

				$channelLetters = get_post_meta( $post_id, 'product_channel_letters', true );
				if ( $channelLetters ) :
					?>

						<div class="mt-8">
							<p class="uppercase text-lg mb-3">CHANNEL LETTERS</p>
							<div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1">
								<div class="font-semibold">NUMBER OF SIGNS</div>
								<div><?php echo $channelLetters['numberOfSigns']; ?></div>
								<div class="font-semibold">SIGN TEXT & CONTEXT</div>
								<div><?php echo $channelLetters['textAndContent']; ?></div>
								<div class="font-semibold">FONT</div>
								<div><?php echo $channelLetters['font'] ?? ''; ?></div>
								<div class="font-semibold">WALL DIMENSION</div>
								<div><?php echo $channelLetters['wallDimension']; ?></div>
								<div class="font-semibold">SIGN DIMENSION</div>
								<div><?php echo $channelLetters['signDimension']; ?></div>
								<div class="font-semibold">material</div>
								<div><?php echo $channelLetters['material']; ?></div>
								<div class="font-semibold">TRIM CAP COLOR</div>
								<div><?php echo $channelLetters['trimCapColor']; ?></div>
								<div class="font-semibold">FACE COLOR</div>
								<div><?php echo $channelLetters['faceColor']; ?></div>
								<div class="font-semibold">RETURN COLOR</div>
								<div><?php echo $channelLetters['returnColor']; ?></div>
								<div class="font-semibold">RETURN DEPTH</div>
								<div><?php echo $channelLetters['returnDepth']; ?></div>
								<div class="font-semibold">TYPES</div>
								<div>
									<?php echo output_array( $channelLetters['types'] ); ?>
								</div>
								<div class="font-semibold">BACKER</div>
								<div><?php echo output_array( $channelLetters['backer'] ); ?></div>
								<div class="font-semibold">MOUNTING</div>
								<div><?php echo output_array( $channelLetters['mounting'] ); ?></div>
								<div class="font-semibold">DESIGN INSPIRATIONS</div>
								<div>
									<?php echo get_design_inspirations( $channelLetters['designInspirations'] ); ?>
								</div>
							</div>
						</div>

						<?php
				endif;


				$dimensionalLetters = get_post_meta( $post_id, 'product_dimensional_letters', true );
				if ( $dimensionalLetters ) :
					?>

						<div class="mt-8">
							<p class="uppercase text-lg mb-3">DIMENSIONAL LETTERS</p>
							<div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1">
								<div class="font-semibold">NUMBER OF SIGNS</div>
								<div><?php echo $dimensionalLetters['numberOfSigns']; ?></div>
								<div class="font-semibold">SIGN TEXT & CONTEXT</div>
								<div><?php echo $dimensionalLetters['textAndContent']; ?></div>
								<div class="font-semibold">FONT</div>
								<div><?php echo $dimensionalLetters['font'] ?? ''; ?></div>
								<div class="font-semibold">WALL DIMENSION</div>
								<div><?php echo $dimensionalLetters['wallDimension']; ?></div>
								<div class="font-semibold">SIGN DIMENSION</div>
								<div><?php echo $dimensionalLetters['signDimension']; ?></div>
								<div class="font-semibold">SIDES</div>
								<div><?php echo $dimensionalLetters['sides']; ?></div>
								<div class="font-semibold">BACK PANEL</div>
								<div><?php echo $dimensionalLetters['backPanel']; ?></div>
								<div class="font-semibold">LOCATION</div>
								<div><?php echo $dimensionalLetters['location']; ?></div>
								<div class="font-semibold">TYPES</div>
								<div>
									<?php echo output_array( $dimensionalLetters['types'] ); ?>
								</div>
								<div class="font-semibold">MOUNTING</div>
								<div><?php echo output_array( $dimensionalLetters['mounting'] ); ?></div>
								<div class="font-semibold">DESIGN INSPIRATIONS</div>
								<div>
									<?php echo get_design_inspirations( $dimensionalLetters['designInspirations'] ); ?>
								</div>
							</div>
						</div>

						<?php
				endif;

				$lightbox = get_post_meta( $post_id, 'product_lightbox', true );
				if ( $lightbox ) :
					?>

						<div class="mt-8">
							<p class="uppercase text-lg mb-3">LIGHTBOX</p>
							<div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1">
								<div class="font-semibold">NUMBER OF SIGNS</div>
								<div><?php echo $lightbox['numberOfSigns']; ?></div>
								<div class="font-semibold">SIGN TEXT & CONTEXT</div>
								<div><?php echo $lightbox['textAndContent']; ?></div>
								<div class="font-semibold">FONT</div>
								<div><?php echo $lightbox['font'] ?? ''; ?></div>
								<div class="font-semibold">WALL DIMENSION</div>
								<div><?php echo $lightbox['wallDimension']; ?></div>
								<div class="font-semibold">SIGN DIMENSION</div>
								<div><?php echo $lightbox['signDimension']; ?></div>
								<div class="font-semibold">DEPTH</div>
								<div><?php echo $lightbox['depth']; ?></div>
								<div class="font-semibold">SIDES</div>
								<div><?php echo $lightbox['sides']; ?></div>
								<div class="font-semibold">COLOR</div>
								<div><?php echo $lightbox['color']; ?></div>
								<div class="font-semibold">RETAINERS</div>
								<div><?php echo $lightbox['retainers']; ?></div>
								<div class="font-semibold">TYPES</div>
								<div>
									<?php echo output_array( $lightbox['types'] ); ?>
								</div>
								<div class="font-semibold">MOUNTING</div>

								<div><?php echo $lightbox['mounting']; ?></div>
								<div class="font-semibold">DESIGN INSPIRATIONS</div>
								<div>
									<?php echo get_design_inspirations( $lightbox['designInspirations'] ); ?>
								</div>
							</div>
						</div>

						<?php
				endif;

				$customJob = get_post_meta( $post_id, 'product_custom_job', true );
				if ( $customJob ) :
					?>

						<div class="mt-8">
							<p class="uppercase text-lg mb-3">CUSTOM JOB</p>
							<div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1">
								<div class="font-semibold">DESCRIPTION</div>
								<div><?php echo $customJob['description']; ?></div>
								<div class="font-semibold">DESIGN INSPIRATIONS</div>
								<div>
									<?php echo get_design_inspirations( $customJob['designInspirations'] ); ?>
								</div>
							</div>
						</div>
						<?php
				endif;

				?>

				</div>
			</div>

		</div>

		<div class="min-w-[300px]">
			<?php $review_studio_link = get_field( 'review_studio_link' ); ?>
			<?php if ( $review_studio_link ) : ?>
				<a href="<?php echo $review_studio_link; ?>" target="_blank"
					class="bg-black text-white button w-full text-center hover:bg-gray-800 transition-all duration-300">
					Review Design
				</a>
			<?php endif; ?>
		</div>

	</div>

</div>