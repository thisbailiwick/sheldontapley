<?php
	use Roots\Sage\ACF_Page_Components;

	if (have_rows('general_page_content')) { // the string here should match the field name for the flexible content object you are targetintg
		$content = get_fields();
		$sections = ACF_Page_Components\get_sections($content['general_page_content']);
		echo $sections;
	}




?>
<?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
