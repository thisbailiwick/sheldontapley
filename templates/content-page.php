<?php
	use Roots\Sage\ACF_Page_Components;

	if (have_rows('content')) {
		$content = get_fields();
		$sections = ACF_Page_Components\get_sections($content['general_page_content']);
		echo $sections;
	}else{
	 the_content();
	}




?>
<?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
