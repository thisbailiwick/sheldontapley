<?php

namespace Roots\Sage\Setup;

use Roots\Sage\Assets;

/**
 * Theme setup
 */
function setup() {
	// Enable features from Soil when plugin is activated
	// https://roots.io/plugins/soil/
	add_theme_support('soil-clean-up');
	add_theme_support('soil-nav-walker');
	add_theme_support('soil-nice-search');
	add_theme_support('soil-jquery-cdn');
	add_theme_support('soil-relative-urls');

	// Make theme available for translation
	// Community translations can be found at https://github.com/roots/sage-translations
	load_theme_textdomain('sage', get_template_directory() . '/lang');

	// Enable plugins to manage the document title
	// http://codex.wordpress.org/Function_Reference/add_theme_support#Title_Tag
	add_theme_support('title-tag');

	// Register wp_nav_menu() menus
	// http://codex.wordpress.org/Function_Reference/register_nav_menus
	register_nav_menus([
		'primary_navigation' => __('Primary Navigation', 'sage')
	]);

	// Enable post thumbnails
	// http://codex.wordpress.org/Post_Thumbnails
	// http://codex.wordpress.org/Function_Reference/set_post_thumbnail_size
	// http://codex.wordpress.org/Function_Reference/add_image_size
	add_theme_support('post-thumbnails');

	// Enable post formats
	// http://codex.wordpress.org/Post_Formats
	add_theme_support('post-formats', ['aside', 'gallery', 'link', 'image', 'quote', 'video', 'audio']);

	// Enable HTML5 markup support
	// http://codex.wordpress.org/Function_Reference/add_theme_support#HTML5
	add_theme_support('html5', ['caption', 'comment-form', 'comment-list', 'gallery', 'search-form']);

	// Use main stylesheet for visual editor
	// To add custom styles edit /assets/styles/layouts/_tinymce.scss
	add_editor_style(Assets\asset_path('styles/main.css'));
}

add_action('after_setup_theme', __NAMESPACE__ . '\\setup');

/**
 * Register sidebars
 */
function widgets_init() {
	register_sidebar([
		'name' => __('Primary', 'sage'),
		'id' => 'sidebar-primary',
		'before_widget' => '<section class="widget %1$s %2$s">',
		'after_widget' => '</section>',
		'before_title' => '<h3>',
		'after_title' => '</h3>'
	]);

	register_sidebar([
		'name' => __('Footer', 'sage'),
		'id' => 'sidebar-footer',
		'before_widget' => '<section class="widget %1$s %2$s">',
		'after_widget' => '</section>',
		'before_title' => '<h3>',
		'after_title' => '</h3>'
	]);
}

add_action('widgets_init', __NAMESPACE__ . '\\widgets_init');

/**
 * Determine which pages should NOT display the sidebar
 */
function display_sidebar() {
	static $display;

	isset($display) || $display = !in_array(true, [
		// The sidebar will NOT be displayed if ANY of the following return true.
		// @link https://codex.wordpress.org/Conditional_Tags
		is_404(),
		is_front_page(),
		is_page_template('template-custom.php'),
		is_post_type_archive('projects'),
    get_post_type() === 'projects',
    is_page_template('template-projects.php')
	]);

	return apply_filters('sage/display_sidebar', $display);
}

/**
 * Theme assets
 */
function assets() {
	wp_enqueue_style('sage/css', Assets\asset_path('styles/main.css'), false, null);

	if (is_single() && comments_open() && get_option('thread_comments')) {
		wp_enqueue_script('comment-reply');
	}

	wp_enqueue_script('sage/js', Assets\asset_path('scripts/main.js'), ['jquery'], null, true);
}

add_action('wp_enqueue_scripts', __NAMESPACE__ . '\\assets', 100);


// Add Projects custom post type
function projects_post_type() {

	$labels = array(
		'name'                  => _x( 'Projects', 'Post Type General Name', 'st_projects' ),
		'singular_name'         => _x( 'Project', 'Post Type Singular Name', 'st_projects' ),
		'menu_name'             => __( 'Projects', 'st_projects' ),
		'name_admin_bar'        => __( 'Projects', 'st_projects' ),
		'archives'              => __( 'Project Archives', 'st_projects' ),
		'attributes'            => __( 'Project Attributes', 'st_projects' ),
		'parent_item_colon'     => __( 'Parent Project:', 'st_projects' ),
		'all_items'             => __( 'All Projects', 'st_projects' ),
		'add_new_item'          => __( 'Add New Project', 'st_projects' ),
		'add_new'               => __( 'Add Project', 'st_projects' ),
		'new_item'              => __( 'New Project', 'st_projects' ),
		'edit_item'             => __( 'Edit Project', 'st_projects' ),
		'update_item'           => __( 'Update Project', 'st_projects' ),
		'view_item'             => __( 'View Project', 'st_projects' ),
		'view_items'            => __( 'View Projects', 'st_projects' ),
		'search_items'          => __( 'Search Project', 'st_projects' ),
		'not_found'             => __( 'Not found', 'st_projects' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'st_projects' ),
		'featured_image'        => __( 'Featured Image', 'st_projects' ),
		'set_featured_image'    => __( 'Set featured image', 'st_projects' ),
		'remove_featured_image' => __( 'Remove featured image', 'st_projects' ),
		'use_featured_image'    => __( 'Use as featured image', 'st_projects' ),
		'insert_into_item'      => __( 'Insert into Project', 'st_projects' ),
		'uploaded_to_this_item' => __( 'Uploaded to this Project', 'st_projects' ),
		'items_list'            => __( 'Projects list', 'st_projects' ),
		'items_list_navigation' => __( 'Projects list navigation', 'st_projects' ),
		'filter_items_list'     => __( 'Filter Projects list', 'st_projects' ),
	);
	$args = array(
		'label'                 => __( 'Project', 'st_projects' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'revisions', 'custom-fields' ),
		'taxonomies'            => array( 'category', 'post_tag' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'post',
	);
	register_post_type( 'projects', $args );

}
add_action( 'init', __NAMESPACE__ . '\\projects_post_type', 0 );


// add_filter('pre_get_posts', __NAMESPACE__ . '\\query_post_type');
// function query_post_type($query) {
//   // if(  is_category() || is_tag() && empty( $query->query_vars['suppress_filters'] ) ) {
//   //   $post_types = get_post_types();
//   //   $query->set( 'post_type', $post_types);
//   //   // print_r($post_types); print_r('<br>');
//   //   $query->set( 'post_type', 'projects');
// 	//   return $query;
//   // }

//   // echo $query->is_page('still-life');
//   if ( $query->is_page('still-life') && $query->is_main_query() ) {
//     $post_types = get_post_types();
//     $query->set( 'post_type', $post_types);
//     // print_r($post_types); print_r('<br>');
//     // $query->set( 'post_type', 'projects');
//     $query->set('cat', '12');
//   }

//   return $query;
// }

if( function_exists('acf_add_options_page') ) {
 $args = array(

	/* (string) The title displayed on the options page. Required. */
	'page_title' => 'Options',

	/* (string) The title displayed in the wp-admin sidebar. Defaults to page_title */
	'menu_title' => '',

	/* (string) The slug name to refer to this menu by (should be unique for this menu).
	Defaults to a url friendly version of menu_slug */
	'menu_slug' => '',

	/* (string) The capability required for this menu to be displayed to the user. Defaults to edit_posts.
	Read more about capability here: http://codex.wordpress.org/Roles_and_Capabilities */
	'capability' => 'edit_posts',

	/* (int|string) The position in the menu order this menu should appear.
	WARNING: if two menu items use the same position attribute, one of the items may be overwritten so that only one item displays!
	Risk of conflict can be reduced by using decimal instead of integer values, e.g. '63.3' instead of 63 (must use quotes).
	Defaults to bottom of utility menu items */
	'position' => false,

	/* (string) The slug of another WP admin page. if set, this will become a child page. */
	'parent_slug' => '',

	/* (string) The icon url for this menu. Defaults to default WordPress gear */
	'icon_url' => false,

	/* (boolean) If set to true, this options page will redirect to the first child page (if a child page exists).
	If set to false, this parent page will appear alongside any child pages. Defaults to true */
	'redirect' => true,

	/* (int|string) The '$post_id' to save/load data to/from. Can be set to a numeric post ID (123), or a string ('user_2').
	Defaults to 'options'. Added in v5.2.7 */
	'post_id' => 'options',

	/* (boolean)  Whether to load the option (values saved from this options page) when WordPress starts up.
	Defaults to false. Added in v5.2.8. */
	'autoload' => false,

);
	$option_page = acf_add_options_page($args);
	// add sub page
    acf_add_options_sub_page(array(
        'page_title' 	=> 'Options',
        'menu_title' 	=> 'Options',
        'parent_slug' 	=> $option_page['menu_slug'],
    ));

}
