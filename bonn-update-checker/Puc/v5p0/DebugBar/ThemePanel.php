<?php

namespace Bonn\PluginUpdateChecker\v5p0\DebugBar;

use Bonn\PluginUpdateChecker\v5p0\Theme\UpdateChecker;

if ( !class_exists(ThemePanel::class, false) ):

	class ThemePanel extends Panel {
		/**
		 * @var UpdateChecker
		 */
		protected $updateChecker;

		protected function displayConfigHeader() {
			$this->row('Theme directory', htmlentities($this->updateChecker->directoryName));
			parent::displayConfigHeader();
		}

		protected function getUpdateFields() {
			return array_merge(parent::getUpdateFields(), array('details_url'));
		}
	}

endif;
