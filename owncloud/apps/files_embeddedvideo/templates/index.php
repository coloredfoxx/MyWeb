<div class="embeddedInfo">
For some plugins it's required to create a public stream to avoid authentication.<br />
Those streams are accessable by default for 5 minutes to start playback.<br />
<br />
Those public streams can be used for streaming over network for instance on your television.<br />
<br />
To playback a video, use the "Embedded Playback" context menu that can be find in the file browser list.
</div>
<?php

$rmVidId	= @$_GET[ 'rmVidId' ];
$files		= array();

$dp = opendir( sys_get_temp_dir() );

while ( $file = readdir( $dp ) ) {
	$ext = substr( $file, -4, 4 );

	if ( $ext != '.fev' )
		continue;

	$vidInfo		= unserialize( @file_get_contents( sys_get_temp_dir().'/'.$file ) );
	$vidInfo[ 'tmp' ]	= sys_get_temp_dir().'/'.$file;

	list( $vidInfo[ 'vidId' ], $ext ) = explode( ".", $file );

	if ( $vidInfo[ 'vidId' ] == $rmVidId ) {
		@unlink( $vidInfo[ 'tmp' ] );
		continue;
	}

	array_push( $files, $vidInfo );
}

closedir( $dp );

?>

<table class="embeddedTable">
<tr class="header">
	<td>File</td>
	<td>Playback expires</td>
	<td>Access</td>
</tr>

<?php


foreach ( $files as $vidInfo ) {
	$file	= OC_Filesystem::getLocalPath( $vidInfo[ 'file' ] );
	$expire	= $vidInfo[ 'expire' ];
	$tmp	= $vidInfo[ 'tmp' ];
	$vidId	= $vidInfo[ 'vidId' ];

	if ( $expire < time() ) {
		@unlink( $tmp );
		continue;
	}

	echo '<tr>';
	echo '<td><a target="_blank" href="'.OCP\Util::linkTo('files_embeddedvideo', 'php/stream.php').'?vidId='.$vidId.'">'.$file.'</a></td>';
	echo '<td>'.date( 'Y-m-d h:i a', $expire ).'</td>';
	echo '<td><a href="?rmVidId='.$vidId.'">Remove</a></td>';
	echo '</tr>';
}

?>

