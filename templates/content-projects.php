<?php
use Roots\Sage\ACF_Page_Components;

if (have_rows('content')) {
	$content = get_fields();
	$sections = ACF_Page_Components\get_sections($post, $content['content']);
	echo $sections;
}
