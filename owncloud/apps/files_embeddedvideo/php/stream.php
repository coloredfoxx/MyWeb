<?php

$vidId		= $_GET[ 'vidId' ];
$vidInfo	= unserialize( @file_get_contents( sys_get_temp_dir().'/'.$vidId.'.fev' ) );

$filename	= $vidInfo[ 'file' ];
$ts		= $vidInfo[ 'expire' ];

if ( $ts < time() ) {
	header( 'HTTP/1.0 404 Not Found' );
	echo 'Expired stream.';
	exit( 0 );
}

function smartReadFile( $location, $filename )
{
	if ( ! file_exists( $location ) ) {
		header( 'HTTP/1.0 404 Not Found' );
		return;
	}

	$size = filesize( $location );
	$time = date( 'r', filemtime( $location ) );

	$fp = fopen( $location, 'rb' );
	if ( ! $fp ) {
		header( 'HTTP/1.0 505 Internal server error' );
		return;
	}

	$begin	= 0;
	$end	= $size;

	if ( isset( $_SERVER[ 'HTTP_RANGE' ] ) ) {
		if ( preg_match( '/bytes=\h*(\d+)-(\d*)[\D.*]?/i', $_SERVER[ 'HTTP_RANGE' ], $matches ) ) { 
			$begin = intval( $matches[ 1 ] );
			if ( ! empty( $matches[ 2 ] ) )
				$end = intval( $matches[ 2 ] );
		}
	}

	if ( $begin > 0 || $end < $size )
		header( 'HTTP/1.0 206 Partial Content' );
	else
		header( 'HTTP/1.0 200 OK' ); 

	header( 'Content-Type: video/x-msvideo');
	header( 'Cache-Control: public, must-revalidate, max-age=0' );
	header( 'Pragma: no-cache' ); 
	header( 'Accept-Ranges: bytes' );
	header( 'Content-Length:'.( $end - $begin ) );
	header( 'Content-Range: bytes '.$begin.'-'.$end.'/'.$size );
	header( 'Content-Disposition: inline; filename='.$filename );
	header( 'Content-Transfer-Encoding: binary' );
	header( 'Last-Modified: '.$time );
	header( 'Connection: close' ); 

	$cur = $begin;
	fseek( $fp, $begin, 0 );

	while ( ! feof( $fp ) && $cur < $end && ( connection_status() == 0 ) ) {
		echo fread( $fp, min( 1024 * 16, $end - $cur ) );
		$cur += 1024 * 16;
	}

	fclose( $fp );
}

smartReadFile( $filename, basename( $filename ) );

?>
