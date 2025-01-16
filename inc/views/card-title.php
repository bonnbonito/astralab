<?php
$user = wp_get_current_user()->display_name;
?>
<p class="uppercase text-lg font-semibold mb-4">Client Portal</p>
<h2 class="uppercase text-3xl font-semibold pb-10 mb-10 border-b-input border border-x-0 border-t-0 ">
  <?php echo $user; ?></h2>