<?php

namespace Bonn\PluginUpdateChecker\v5p0;

use Bonn\PluginUpdateChecker\v5\PucFactory as MajorFactory;
use Bonn\PluginUpdateChecker\v5p0\PucFactory as MinorFactory;

require __DIR__ . '/Puc/v5p0/Autoloader.php';
new Autoloader();

require __DIR__ . '/Puc/v5p0/PucFactory.php';
require __DIR__ . '/Puc/v5/PucFactory.php';

//Register classes defined in this version with the factory.
foreach (
	array(
		'Plugin\\UpdateChecker' => Plugin\UpdateChecker::class,
		'Theme\\UpdateChecker'  => Theme\UpdateChecker::class,

		'Vcs\\PluginUpdateChecker' => Vcs\PluginUpdateChecker::class,
		'Vcs\\ThemeUpdateChecker'  => Vcs\ThemeUpdateChecker::class,

		'GitHubApi'    => Vcs\GitHubApi::class,
	)
	as $pucGeneralClass => $pucVersionedClass
) {
	MajorFactory::addVersion($pucGeneralClass, $pucVersionedClass, '5.0');
	//Also add it to the minor-version factory in case the major-version factory
	//was already defined by another, older version of the update checker.
	MinorFactory::addVersion($pucGeneralClass, $pucVersionedClass, '5.0');
}

