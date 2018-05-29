<?php
/**
 * Template Name: Projects
 */


?>

<?php //while (have_posts()) : the_post(); ?>
	<?php //get_template_part('templates/page', 'header'); ?>
	<?php //get_template_part('templates/content', 'projects'); ?>
<?php //endwhile; ?>


<?php

 $page_term = get_field('page_term');
// Define custom query parameters
$args = array(
  'posts_per_page' => 10,
  'post_type' => 'projects',
	'order' => 'ASC',
  'post_status' => 'publish',
  'category_name' => $page_term[0]->slug,
	'meta_key' => '_reorder_term_category_' . $page_term[0]->slug,
	'orderby' => 'meta_value_num title'
  );

  // Get current page and append to custom query parameters array
  $args['paged'] = get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1;

  // Instantiate custom query
  $the_query = new WP_Query( $args );

  // Pagination fix
  $temp_query = $wp_query;
  $wp_query   = NULL;
  $wp_query   = $temp_query;

  // Output custom query loop
  if ( $the_query->have_posts() ) :
  while ( $the_query->have_posts() ) :
  $the_query->the_post();
    get_template_part('templates/page', 'header');
    get_template_part('templates/content', 'projects');
            endwhile;
  endif;
  $big = 999999999; // need an unlikely integer
   echo paginate_links( array(
      'base' => str_replace( $big, '%#%', get_pagenum_link( $big ) ),
      'format' => '?paged=%#%',
      'current' => max( 1, get_query_var('paged') ),
      'total' => $the_query->max_num_pages
  ) );

  wp_reset_postdata();
