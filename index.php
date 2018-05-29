<?php get_template_part('templates/page', 'header'); ?>

<?php if (!have_posts()) : ?>
    <div class="alert alert-warning">
		<?php _e('Sorry, no results were found.', 'sage'); ?>
    </div>
	<?php get_search_form(); ?>
<?php endif; ?>
<div class="posts-main">
<?php while (have_posts()) : the_post(); ?>
        <h1><a href="<?php the_permalink() ?>" rel="bookmark" title="permalink"><?php the_title(); ?></a></h1>
        <h2>Posted on <?php the_time('F d, Y'); ?></h2>
        <div class="post-main-content"><?php the_content(); ?></div>

        <div id="social-sharing">
            <div id="emailbutton"><a href="mailto:?subject=Check out this blog post by Sheldon Tapley&body=<?php the_permalink() ?>">Email This</a></div>
            <div id="twitterbutton"><a href="http://twitter.com/share?url=<?php the_permalink() ?>" target="_blank" onfocus="this.blur();">Tweet This</a></div>
            <div id="sharebutton">
                <script>function fbs_click() {u=location.href;t=document.title;window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(t),'sharer','toolbar=0,status=0,width=626,height=436');return false;}</script>
                <a href="http://www.facebook.com/share.php?u=<?php the_permalink() ?>" onclick="return fbs_click()" target="_blank" onfocus="this.blur();">Share on Facebook </a>
            </div>
            <div id="linkedinbutton"><a href="http://www.linkedin.com/shareArticle?mini=true&url=<?php the_permalink(); ?>&title=<?php the_title(); ?>&source=http://www.sheldontapley.com/blog" target="_blank" onfocus="this.blur();">Share on LinkedIn</a></div>
        </div>

        <p class="post-details"><a href="<?php comments_link(); ?>"><?php comments_number("Leave a Comment","One Comment","% Comments") ?></a> &nbsp;|&nbsp; <?php if (pings_open()) : ?><a href="<?php trackback_url() ?>" rel="trackback">Trackback</a> &nbsp;|&nbsp; <?php endif; ?>Posted in <?php the_category(', ') ?></p>




        <!-- ============== Comments ============== -->

	<?php comments_template(); ?>


        <!-- ============== /Comments ============== -->

<?php endwhile; ?>
</div>
<?php the_posts_navigation(); ?>
