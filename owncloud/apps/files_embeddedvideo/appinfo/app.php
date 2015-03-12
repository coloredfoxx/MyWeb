<?php

OCP\Util::addscript( 'files_embeddedvideo', 'loader' );
OCP\Util::addscript( 'files_embeddedvideo', 'jquery.selectText.min' );
OCP\Util::addStyle( 'files_embeddedvideo', 'style' );

OCP\App::addNavigationEntry(array(
                'id' => 'files_embeddedvideo_index',
                'order' => 3,
                'href' => OCP\Util::linkTo( 'files_embeddedvideo', 'index.php' ),
                'icon' => OCP\Util::linkTo( 'files_embeddedvideo', 'img/embeddedvideo.png' ),
                'name' => 'Streaming' )
);

?>
