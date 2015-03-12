var infoOverlay = {
	overlay : null,
	init : function() {
		$( '<div id="infoOverlay" class="infoOverlay"></div>' ).appendTo( 'body' );

		infoOverlay.overlay = $( '#infoOverlay' );
	},
	show : function( e ) {
		$( this ).mouseout( infoOverlay.hide );
		$( this ).mousemove( infoOverlay.move );
		infoOverlay.overlay.finish();
		infoOverlay.overlay.fadeIn( 'fast' );
	},
	hide : function( e ) {
		infoOverlay.overlay.fadeOut( 'fast' );
	},
	move : function( e ) {
		infoOverlay.overlay.html( $( this ).attr( 'help' ) );
		infoOverlay.overlay.css( 'left', e.pageX - window.pageXOffset + 10 );
		infoOverlay.overlay.css( 'top', e.pageY - window.pageYOffset + 10 );
	}
};

var vlcControl = {
	vlc : null,
	init : function() {
		vlcControl.vlc = document.getElementById( 'vlc' );

		if ( ! vlcControl.vlc.audio || ! vlcControl.vlc.subtitle || vlcControl.vlc.input.time == 0 ) {
			window.setTimeout( 'vlcControl.init()', 1000 );
			return;
		}

		vlcControl.initAudio();
		vlcControl.initSubtitle();
	},
	initAudio : function() {
		if ( vlcControl.vlc.audio.count < 3 )
			return;

		defaultTrack	= vlcControl.vlc.audio.track;
		failedTracks	= 0;

		$( '#switchAudioTrack' ).empty();
		$( '#switchAudioTrack' ).append( '<option value="-1">Disabled Audio</option>' );
		for ( i = 1; i < vlcControl.vlc.audio.count; i++ ) {
			vlcControl.vlc.audio.track = i;

			if ( vlcControl.vlc.audio.track == -1 ) {
				failedTracks++;
				continue;
			}
			if ( vlcControl.vlc.audio.track != i )
				failedTracks++;

			try {
				$( '#switchAudioTrack' ).append( '<option value="'+( i + failedTracks )+'">'+vlcControl.vlc.audio.description( i )+'</option>' );
			} catch ( e ) {}
		}

		vlcControl.vlc.audio.track = defaultTrack;

		$( '#switchAudioTrack' ).val( defaultTrack );
		$( '#switchAudioTrack' ).fadeIn( 'slow' );
	},
	initSubtitle : function() {
		if ( vlcControl.vlc.subtitle.count < 2 )
			return;

		defaultTrack	= vlcControl.vlc.subtitle.track;
		failedTracks	= 0;

		$( '#switchSubtitleTrack' ).empty();
		$( '#switchSubtitleTrack' ).append( '<option value="-1">Disabled Subtitle</option>' );
		for ( i = 1; i < vlcControl.vlc.subtitle.count; i++ ) {
			vlcControl.vlc.subtitle.track = i;

			if ( vlcControl.vlc.subtitle.track == -1 ) {
				failedTracks++;
				continue;
			}
			if ( vlcControl.vlc.subtitle.track != i )
				failedTracks++;

			try {
				$( '#switchSubtitleTrack' ).append( '<option value="'+( i + failedTracks )+'">'+vlcControl.vlc.subtitle.description( i )+'</option>' );
			} catch ( e ) {}
		}

		vlcControl.vlc.subtitle.track = defaultTrack;

		$( '#switchSubtitleTrack' ).val( defaultTrack );
		$( '#switchSubtitleTrack' ).fadeIn( 'slow' );

	},
	switchAudioTrack : function() {
		vlcControl.vlc.audio.track = parseInt( $(this).val() );
		$( '#switchAudioTrack' ).val( vlcControl.vlc.audio.track );
	},
	switchSubtitleTrack : function() {
		vlcControl.vlc.subtitle.track = parseInt( $(this).val() );
		$( '#switchSubtitleTrack' ).val( vlcControl.vlc.subtitle.track );
	}
};

var embeddedVideo = {
	file : null,
	dir : null,
	vidId : null,
	stream : null,
	vidUrl : null,
	timeouts : [
		[ '31536000',	'1 Year' ],
		[ '2592000',	'1 Month' ],
		[ '604800',	'1 Week' ],
		[ '86400',	'1 Day' ],
		[ '3600',	'1 Hour' ],
		[ '300',	'5 Minutes' ],
	],
	createPlayer : function( mime ) {
		$( '<embed type="'+mime+'" id="vlc" src="'+embeddedVideo.vidUrl+'"></embed>' ).appendTo( '.embeddedOverlayVideo' );

		vlcControl.init();
	},
	show : function() {
		embeddedVideo.vidUrl	= OC.linkTo('files_embeddedvideo', 'php/stream.php')+'?vidId='+embeddedVideo.vidId;
		embeddedVideo.stream	= $(location).attr('protocol')+'//'+$(location).attr('host')+embeddedVideo.vidUrl;

		menuButtons		= '<select id="plugin" help="Switch between different plugins for playback."></select>';

		menuButtons		+= '<select id="timeout" help="Set the timeout for starting this stream over the network.">';
		for ( i = 0; i < embeddedVideo.timeouts.length; i++ )
			menuButtons	+= '<option value="'+embeddedVideo.timeouts[ i ][ 0 ]+'">'+embeddedVideo.timeouts[ i ][ 1 ]+'</option>';
		menuButtons		+= '</select>';

		menuButtons	+= '<div id="stream" help="Open the link for direct streaming.">Stream</div>';
		menuButtons	+= '<div id="tinyUrl" help="Generate a TinyURL for direct streaming.">TinyURL</div>';
		menuButtons	+= '<select id="switchAudioTrack" help="Switch the audio track."></select>';
		menuButtons	+= '<select id="switchSubtitleTrack" help="Switch the subtitle track."></select>';
		menuButtons	+= '<div id="close"></div>';

		$( '<div id="embeddedOverlay" class="embeddedOverlay"><div class="embeddedOverlayMenu" id="embeddedOverlayMenu"></div><div class="embeddedOverlayVideo"></div></div>' ).appendTo( 'body' );
		$( menuButtons ).appendTo( '#embeddedOverlayMenu' );
		embeddedVideo.createPlayer( 'video/x-msvideo' );
		embeddedVideo.listPlugins();

		$( '#close' ).click( embeddedVideo.hide );
		$( '#timeout' ).click( embeddedVideo.setTimeout );
		$( '#stream' ).click( embeddedVideo.openStream );
		$( '#tinyUrl' ).click( embeddedVideo.makeTinyUrl );

		$( '#plugin' ).change( embeddedVideo.changePlugin );
		$( '#switchAudioTrack' ).change( vlcControl.switchAudioTrack );
		$( '#switchSubtitleTrack' ).change( vlcControl.switchSubtitleTrack );

		$( '#plugin' ).mouseover( infoOverlay.show );
		$( '#timeout' ).mouseover( infoOverlay.show );
		$( '#stream' ).mouseover( infoOverlay.show );
		$( '#tinyUrl' ).mouseover( infoOverlay.show );
		$( '#switchAudioTrack' ).mouseover( infoOverlay.show );
		$( '#switchSubtitleTrack' ).mouseover( infoOverlay.show );

		$( '#timeout' ).val( '300' );

		$( '#embeddedOverlay' ).fadeIn( 'fast' );

		infoOverlay.init();
	},
	hide : function() {
		$( '#infoOverlay' ).remove();
		$( '#embeddedOverlay' ).fadeOut( 'fast', function() {
			$( '#embeddedOverlay' ).remove();
		});
	},
	requestVID : function( file ) {
		embeddedVideo.file = file;
		embeddedVideo.dir = $( '#dir' ).val();

		$.ajax({
			url : OC.linkTo( 'files_embeddedvideo', 'php/genvidid.php' )+'?dir='+encodeURIComponent( embeddedVideo.dir ).replace( /%2F/g, '/' )+'&file='+encodeURIComponent( embeddedVideo.file.replace( '&', '%26' ) ),
		}).done( function( vidId ) {
			embeddedVideo.vidId = vidId;
			embeddedVideo.show();
		}).fail( function() {
			alert( 'Failed to request video.' );
		});
	},
	makeTinyUrl : function() {
		$( this ).html( 'Generating TinyURL, please wait...' );

		$.ajax({
			url : OC.linkTo( 'files_embeddedvideo', 'php/tinyurl.php' )+'?url='+encodeURIComponent( embeddedVideo.stream ),
		}).done( function( data ) {
			$( '#tinyUrl' ).html( data );
			$( '#tinyUrl' ).unbind( 'click' );
			$( '#tinyUrl' ).css( 'cursor', 'auto' );

			$( '#tinyUrl' ).mousemove( function() {
				$(this).selectText();
			} );
		}).fail( function() {
			alert( 'Failed to create a TinyURL link!' );
			$( '#tinyUrl' ).html( 'TinyURL' );
		});
	},
	setTimeout : function() {
		timeout = $( this ).val();

		$.ajax({
			url : OC.linkTo( 'files_embeddedvideo', 'php/setexpire.php' )+'?timeout='+timeout+'&vidId='+embeddedVideo.vidId,
		}).done( function( data ) {
		}).fail( function() {
			alert( 'Failed to set expire time.' );
		});
	},
	openStream : function() {
		window.open( embeddedVideo.stream, '_blank' );
	},
	changePlugin : function() {
		$( '#switchAudioTrack' ).fadeOut( 'fast' );
		$( '#switchSubtitleTrack' ).fadeOut( 'fast' );

		$( '.embeddedOverlayVideo' ).empty();
		embeddedVideo.createPlayer( $( this ).val() );
	},
	getMimeCount : function( mimeSearch, currentPluginPos ) {
		var count = 0;

		for ( var i = 0; i <= currentPluginPos; i++ ) {
			for ( var j = 0; j < navigator.plugins[ i ].length; j++ ) {
				var pluginMime = navigator.plugins[ i ][ j ].type;

				if ( pluginMime == mimeSearch )
					count++;
			}
		}

		return count;
	},
	listPlugins : function() {
		$( '<option value="video/x-msvideo">Generic Playback</option>' ).appendTo( '#plugin' );

		for ( var i = 0; i < navigator.plugins.length; i++ ) {
			var count	= 0;
			var canVideo	= false;
			var pluginName	= navigator.plugins[ i ].name;

			for ( var j = 0; j < navigator.plugins[ i ].length; j++ ) {
				var pluginMime	= navigator.plugins[ i ][ j ].type;

				canVideo	= ( pluginMime.indexOf( 'video/' ) == 0 ) ? true : false;
				canVideo	|= ( pluginMime.indexOf( 'application/x-fb-vlc' ) == 0 ) ? true : false;
				count		= embeddedVideo.getMimeCount( pluginMime, i );

				if ( canVideo == true && count == 1 )
					break;
			}

			if ( count == 1 && canVideo == true )
				$( '<option value="'+pluginMime+'">'+pluginName+'</option>' ).appendTo( '#plugin' );
		}
	}
};

$( document ).ready( function () {
	if ( ! OC.currentUser )
		return;

	if ( typeof FileActions !== 'undefined' ) {
		OCA.Files.fileActions.register( 'file' ,'Embedded Playback', OC.PERMISSION_READ, OC.linkTo( 'files_embeddedvideo', 'img/playback.png' ), embeddedVideo.requestVID );
		OCA.Files.fileActions.register( 'video' ,'Embedded Playback', OC.PERMISSION_READ, OC.linkTo( 'files_embeddedvideo', 'img/playback.png' ), embeddedVideo.requestVID );
		OCA.Files.fileActions.setDefault( 'video' ,'Embedded Playback' );
	}
} );

