<div class="mt-8">
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

	$attachments = [];
	if ( $trello_card_attachments ) {
		foreach ( $trello_card_attachments as $attachment ) {
			$attachments[] = '<a href="' . $attachment['url'] . '" target="_blank">' . $attachment['name'] . '</a>';
		}
	}

	?>

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
      <div><?php echo implode( ', ', $attachments ); ?></div>
    </div>
  </div>

  <h3 class="uppercase">PRODUCT TYPES:</h3>

  <div class="grid grid-cols-1 gap-y-10 mt-4">

    <?php $ada = get_post_meta( $post_id, 'product_ada', true );

		if ( $ada ) :

			?>
    <div class="">
      <p class="uppercase text-lg mb-3">ADA WAYFINDING</p>
      <div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1">
        <div class="font-semibold">NUMBER OF SIGNS</div>
        <div><?php echo $ada['numberOfSigns']; ?></div>
        <?php foreach ( $ada['signs'] as $index => $sign ) : ?>
        <div class="font-semibold pl-2">NO.<?php echo $index + 1; ?> NAME</div>
        <div><?php echo $sign['name']; ?></div>
        <div class="font-semibold pl-2">NO.<?php echo $index + 1; ?> DIMENSION</div>
        <div><?php echo $sign['dimension']; ?></div>
        <div class="font-semibold pl-2">NO.<?php echo $index + 1; ?> DETAILS</div>
        <div><?php echo $sign['details']; ?></div>
        <?php endforeach; ?>
        <div class="font-semibold">TYPES</div>
        <div><?php echo implode( ', ', $ada['types'] ); ?></div>
        <div class="font-semibold">DESIGN INSPIRATIONS</div>
        <div><?php echo implode( ', ', $ada['designInspirations'] ); ?></div>
      </div>
    </div>
    <?php endif;

		$monuments = get_post_meta( $post_id, 'product_monuments', true );

		if ( $monuments ) :
			?>

    <div class="">
      <p class="uppercase text-lg mb-3">MONUMENTS & PYLONS</p>
      <div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1">
        <div class="font-semibold">NUMBER OF SIGNS</div>
        <div><?php echo $monuments['numberOfSigns']; ?></div>
        <div class="font-semibold">SIGN TEXT & CONTEXT</div>
        <div><?php echo $monuments['textAndContent']; ?></div>
        <div class="font-semibold">VENDOR</div>
        <div><?php echo $monuments['vendor']; ?></div>
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
        <div><?php echo implode( ', ', $monuments['types'] ); ?></div>
        <div class="font-semibold">ILLUMINATION</div>
        <div><?php echo implode( ', ', $monuments['illumination'] ); ?></div>
        <div class="font-semibold">DESIGN INSPIRATIONS</div>
        <div><?php echo implode( ', ', $monuments['designInspirations'] ); ?></div>
      </div>
    </div>

    <?php
		endif;

		$channelLetters = get_post_meta( $post_id, 'product_channel_letters', true );
		if ( $channelLetters ) :
			?>

    <div class="">
      <p class="uppercase text-lg mb-3">CHANNEL LETTERS</p>
      <div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1">
        <div class="font-semibold">NUMBER OF SIGNS</div>
        <div><?php echo $channelLetters['numberOfSigns']; ?></div>
        <div class="font-semibold">SIGN TEXT & CONTEXT</div>
        <div><?php echo $channelLetters['textAndContent']; ?></div>
        <div class="font-semibold">FONT</div>
        <div><?php echo $channelLetters['font'] ?? ''; ?></div>
        <div class="font-semibold">VENDOR</div>
        <div><?php echo $channelLetters['vendor']; ?></div>
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
        <div><?php echo implode( ', ', $channelLetters['types'] ); ?></div>
        <div class="font-semibold">BACKER</div>
        <div><?php echo implode( ', ', $channelLetters['backer'] ); ?></div>
        <div class="font-semibold">MOUNTING</div>
        <div><?php echo implode( ', ', $channelLetters['mounting'] ); ?></div>
        <div class="font-semibold">DESIGN INSPIRATIONS</div>
        <div><?php echo implode( ', ', $channelLetters['designInspirations'] ); ?></div>
      </div>
    </div>

    <?php
		endif;


		$dimensionalLetters = get_post_meta( $post_id, 'product_dimensional_letters', true );
		if ( $dimensionalLetters ) :
			?>

    <div class="">
      <p class="uppercase text-lg mb-3">DIMENSIONAL LETTERS</p>
      <div class="grid grid-cols-[200px_1fr] gap-x-8 gap-y-1">
        <div class="font-semibold">NUMBER OF SIGNS</div>
        <div><?php echo $dimensionalLetters['numberOfSigns']; ?></div>
        <div class="font-semibold">SIGN TEXT & CONTEXT</div>
        <div><?php echo $dimensionalLetters['textAndContent']; ?></div>
        <div class="font-semibold">FONT</div>
        <div><?php echo $dimensionalLetters['font'] ?? ''; ?></div>
        <div class="font-semibold">VENDOR</div>
        <div><?php echo $dimensionalLetters['vendor']; ?></div>
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
        <div><?php echo implode( ', ', $dimensionalLetters['types'] ); ?></div>
        <div class="font-semibold">MOUNTING</div>
        <div><?php echo implode( ', ', $dimensionalLetters['mounting'] ); ?></div>
        <div class="font-semibold">DESIGN INSPIRATIONS</div>
        <div><?php echo implode( ', ', $dimensionalLetters['designInspirations'] ); ?></div>
      </div>
    </div>

    <?php
		endif;

		$lightbox = get_post_meta( $post_id, 'product_lightbox', true );
		if ( $lightbox ) :
			?>

    <div class="">
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
        <div><?php echo implode( ', ', $lightbox['types'] ); ?></div>
        <div class="font-semibold">MOUNTING</div>
        <div><?php echo implode( ', ', $lightbox['mounting'] ); ?></div>
        <div class="font-semibold">DESIGN INSPIRATIONS</div>
        <div><?php echo implode( ', ', $lightbox['designInspirations'] ); ?></div>
      </div>
    </div>

    <?php
		endif;



		?>

  </div>

</div>