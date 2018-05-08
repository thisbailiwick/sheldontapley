<?php

namespace Roots\Sage\ACF_Page_Components;

function get_sections($post, $sections) {
  $sections_html = '';
  foreach ($sections as $section) {
    $section_type = $section['acf_fc_layout'];
    if ($section_type == 'image_text_style_2' || $section_type === 'text_style_2') {
      $section_type = str_replace('_style_2', '', $section_type);
    }
    $function_html = 'Roots\\Sage\\ACF_Page_Components\\' . "html_" . $section_type;

    if (function_exists($function_html)) {
      $id_tag = $section['acf_fc_layout'] . '-' . time();

      $sections_html .= $function_html($section, $id_tag, $post);
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

function html_image($content, $id_tag) {
  $img = get_image_html($content['image_file']);
  $content['caption'] = get_caption($content['caption_text']);
  $content['position_image'] = $content['image_width'] === 'full' ? 'center' : $content['position_image'];
  $html = <<<HTML
			<div class="{$content['acf_fc_layout']} img-width-{$content['image_width']} img-{$content['position_image']} {$content['acf_fc_layout']}"{$id_tag}>
				{$img}
        {$content['caption']}
			</div>

HTML;

  return $html;

}

function html_title_text($content, $id_tag) {

  $html = <<<HTML
			<h2 class="{$content['acf_fc_layout']}-section {$content['acf_fc_layout']}"{$id_tag}>
				{$content['title_text']}
			</h2>

HTML;

  return $html;
}

function html_body_text($content, $id_tag) {

  $html = <<<HTML
			<div class="{$content['acf_fc_layout']}-section{$content['acf_fc_layout']}"{$id_tag}>
				<div class="text">{$content['body_text']}</div>
			</div>

HTML;

  return $html;
}

function html_image_file($content) {
  $image = $content['image_file'];
  return <<<HTML
			<div class="{$content['acf_fc_layout']}">
			<img src="{$image['url']}" alt="{$image['alt']}" />
			</div>
HTML;

}

function html_artwork_piece($content, $unique_id, $post) {
  $image = $content['artwork_piece'];
  $permalink = get_permalink($post->ID);

  $dev_share_buttons = get_dev_share_buttons(array('facebook', 'twitter', 'email', 'copy'), $permalink, $post->post_title, '', $image['url'], $post->ID);
  return <<<HTML
			<div class="{$content['acf_fc_layout']}">
          <div class="image-wrap">
            <div class="image-centered-background"></div>
            <img class="main-img" src="{$image['url']}" alt="{$image['alt']}" data-width={$image['width']} data-height={$image['height']}/>
            <div class="zoomy-wrap">
              <div id="{$unique_id}" class="mouse-map" style="background-image: url('{$image['url']}'); background-size: {$image['width']}px {$image['height']}px"></div>
              {$dev_share_buttons}
            </div>
            <div class="info-text"></div>
            <div class="artwork-meta">
              <div class="caption">{$content['caption_text']}</div>
              <div class="actions">
                <div class="zoom fas fa-search-plus" data-large-image="{$image['url']}" data-zoom-unique-id="{$unique_id}"></div>
                <div class="info fas fa-info-circle"></div>
                <div class="share fas fa-share-square"></div>
              </div>
            </div>
          </div>
			</div>
HTML;

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
  $piece = $content['audio_file'];

  $container_id = 'audio-container-' . rand(1000, 10000000);
  $player_id = 'audio-player-' . rand(1000, 10000000);
	$audio_url = htmlspecialchars($content['audio_file']['url']);
  $pieces = <<<HTML
				<div class="audio-piece" data-url="{$audio_url}" data-mime_type="{$content['audio_file']['mime_type']}">
					<button class="play">Play</button>
					<button class="pause">Pause</button>
          <div class="volume span-value-wrap">
            <div class="span-value">
              <div class="span-value-jump">
                <div></div>
              </div>
            </div>
          </div>
					<div class="progress span-value-wrap">
            <div class="span-value">
              <div class="span-value-jump">
                <div></div>
              </div>
            </div>
          </div>
          <div class="duration"></div>
          <div class="timer"></div>
				</div>
HTML;

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
  $image = get_image($content['image_file']);
  $embed = get_video_embed_html($content['acf_fc_layout'], $content['video_iframe'], $image, $content['caption'], $id_tag);

  $html = <<<HTML
				{$embed}
HTML;

  return $html;
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
  $embed = htmlentities(preg_replace('/\n/', '', $embed));

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
