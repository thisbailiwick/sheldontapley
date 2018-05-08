<?php

namespace Roots\Sage\ACF_Page_Components;

function get_sections($sections) {
	$sections_html = '';
	foreach ($sections as $section) {
		$section_type = $section['acf_fc_layout'];
		if ($section_type == 'image_text_style_2' || $section_type === 'text_style_2') {
			$section_type = str_replace('_style_2', '', $section_type);
		}
		$function_html = 'Roots\\Sage\\ACF_Page_Components\\' . "html_" . $section_type;

		if (function_exists($function_html)) {

			$id_tag = $section['custom_id_anchor_tag'] ? ' id="' . $section['custom_id_anchor_tag'] . '"' : '';

			$sections_html .= $function_html($section, $id_tag);
		}
	}

	return do_shortcode($sections_html);
}

function html_quote($content, $id_tag) {
	$show_top_bottom_border = $content['show_top_bottom_border'] ? ' show_top_bottom_border' : '';

	$html = <<<HTML
			<div class="{$content['acf_fc_layout']}{$show_top_bottom_border}"{$id_tag}>
					{$content['text']}
			</div>
HTML;

	return $html;
}

function html_image_text($content, $id_tag) {
	$img = get_image_html($content['image']);
	$content['caption'] = get_caption($content['caption']);
	$content['position_image'] = $content['image_width'] === 'full' ? 'center' : $content['position_image'];
	$default_acf_style = $content['acf_fc_layout'] === 'image_text_style_2' ? ' image_text' : '';
	$content_main = parse_for_mobile_placeholder($content['text'], $content['image']);
	$has_mobile_image = $content_main[1] ? ' separate-mobile-image' : '';
	$content_main = $content_main[0];
	$html = <<<HTML
			<div class="{$content['acf_fc_layout']} img-width-{$content['image_width']} img-{$content['position_image']}{$default_acf_style}{$has_mobile_image}"{$id_tag}>
				<div class="image cf">
					{$img}
					{$content['caption']}
				</div>
				<div class="text">{$content_main}</div>
			</div>

HTML;

	return $html;

}

function html_text($content, $id_tag) {
	$default_acf_style = $content['acf_fc_layout'] === 'text_style_2' ? ' text-section' : '';

	$html = <<<HTML
			<div class="{$content['acf_fc_layout']}-section{$default_acf_style}"{$id_tag}>
				<div class="text">{$content['text']}</div>
			</div>

HTML;

	return $html;
}

function html_2_column($content, $id_tag) {
	$header = !empty($content['header']) ? '<h2>' . $content['header'] . '</h2>' : '';
	$html = <<<HTML
			<div class="cf column-{$content['acf_fc_layout']}"{$id_tag}>
				{$header}
				<div class="column column-1">
					{$content['column_1']}
				</div>
				<div class="column column-2">
					{$content['column_2']}
				</div>
			</div>

HTML;

	return $html;
}

function html_audio($content, $id_tag) {
	$pieces = '';
	foreach ($content['pieces'] as $index => $piece) {

		$container_id = 'audio-container-' . $index . '-' . rand(1000, 10000000);
		$player_id = 'audio-player-' . $index . '-' . rand(1000, 10000000);

		$pieces .= <<<HTML
				<div class="audio-piece">
					{$piece['title_and_meta']}
					<div id="{$player_id}" class="jp-jplayer" data-title="{$piece['title']}" data-file-url="{$piece['file']['url']}"></div>
					<div id="{$container_id}" class="jp-audio" role="application" aria-label="media player">
						<div class="jp-type-single">
							<div class="jp-gui jp-interface">
								<div class="jp-controls">
									<button class="jp-play" role="button" tabindex="0">
										<svg viewBox="15 11 24 29" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
											<polygon id="Triangle" stroke="none" fill="#63737E" fill-rule="evenodd" transform="translate(26.500000, 25.906977) rotate(90.000000) translate(-26.500000, -25.906977) " points="26.5 14.4069767 40.4069767 37.4069767 12.5930233 37.4069767"></polygon>
										</svg>
									</button>
									<button class="jp-pause" role="button" tabindex="0">
										<svg  viewBox="0 0 22 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
											<rect id="Rectangle-2" stroke="none" fill="#63737E" fill-rule="evenodd" x="0" y="0" width="8" height="25"></rect>
											<rect id="Rectangle-2-Copy" stroke="none" fill="#63737E" fill-rule="evenodd" x="14" y="0" width="8" height="25"></rect>
										</svg>
									</button>
								</div>
								<div class="jp-progress-wrap">
									<div class="jp-current-time" role="timer" aria-label="time"></div>
									<div class="jp-progress">
										<div class="jp-seek-bar">
											<div class="jp-play-bar"></div>
										</div>
									</div>
									<div class="jp-duration" role="timer" aria-label="duration"></div>
								</div>
								<div class="jp-volume-controls">
									<span class="audio-icon"></span>
									<div class="jp-volume-bar">
										<div class="jp-volume-bar-value"></div>
									</div>
								</div>
							</div>
							<div class="jp-no-solution" style="display: none;">
								<span>Update Required</span>
								To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
							</div>
					</div>
					</div>
					<div class="post-player-text">
						{$piece['post_player_text']}
					</div>
				</div>
HTML;
	}

	$html = <<<HTML
		
			<div class="{$content['acf_fc_layout']}"{$id_tag}>
			<h2>{$content['header']}</h2>
				{$pieces}
			</div>

HTML;

	return $html;
}

function html_video($content, $id_tag = false) {
	$id_tag = $id_tag ?: 'video-' . random_int(100, 100000000);
	$image = get_image($content['image']);
	$content['caption'] = get_caption($content['caption']);
	$embed = preg_replace('/\n/', '', $content['embed_code']);
	$embed = get_video_embed_html($content['acf_fc_layout'], $embed, $image, $content['caption'], $id_tag);

	$html = <<<HTML
				{$embed}

HTML;

	return $html;
}

function html_video_section($content, $id_tag = false) {
	$videos_html = '';

	foreach ($content['videos'] as $index => $video) {
		$embed = preg_replace('/\n/', '', $video['fields']['embed_code']);
		$image = get_image($video['fields']['image']);
		$video['fields']['caption'] = get_caption($video['fields']['caption']);
		$video_id = 'video-' . random_int(100, 100000000);
		$videos_html .= get_video_embed_html($content['acf_fc_layout'], $embed, $image, $video['fields']['caption'], $video_id);
	}
	$header = !empty($content['header']) ? '<h2>' . $content['header'] . '</h2>' : '';


	return <<<HTML
			<div class="{$content['acf_fc_layout']}-wrap video"{$id_tag}>
				{$header}
				{$videos_html}
			</div>
HTML;

}

function html_image_slider($content, $id_tag = false) {
	$slides_html = '';
	foreach ($content['slides'] as $slide) {
		$image = get_image($slide['image']);
		$slide['caption'] = get_caption($slide['caption']);
		$slides_html .= <<<HTML
				<div class="carousel-cell">
					{$image}
					<div class="text">
						{$slide['caption']}
					</div>
				</div>
HTML;

	}
	$html = <<<HTML
			<div class="carousel-wrap {$content['acf_fc_layout']}"{$id_tag}>
				<div class="carousel">
					{$slides_html}
				</div>
			</div>
HTML;

	return $html;
}

// Utility functions

function get_image_html($image) {
	return <<<HTML
			<img src="{$image['url']}" alt="{$image['alt']}" /> 
HTML;

}

function get_caption($caption) {
	if (!empty($caption)) {

		$caption = '<div class="captions">' . $caption . '</div>';
	}

	return $caption;
}

function get_image($image, $is_mobile = false) {

	$mobile_mark = $is_mobile ? ' class="mobile-placeholder"' : '';

	return '<img src="' . $image['url'] . '" alt="' . $image['alt'] . '"' . $mobile_mark . ' />';
}

function parse_for_mobile_placeholder($text, $image) {
	$image_html = get_image($image, true);
	$new_text = preg_replace('/\[mobile\-image\]/', $image_html, $text);

	$found = $new_text !== $text;

	return array($new_text, $found);
}

function get_video_embed_html($layout_type, $embed, $image, $caption, $id_tag) {
	$embed = urlencode($embed);

	return <<<HTML
			<div class="{$layout_type}" id="{$id_tag}">
				<div class="video-play-screenshot">
					{$image}
					{$caption}
					<button class="play-button" data-toggle="modal" data-embed="{$embed}" data-target="#video-modal"></button>
				</div>
			</div>
HTML;

}