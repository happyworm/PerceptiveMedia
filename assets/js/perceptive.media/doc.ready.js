/*
 * jQuery Document Ready code for Perceptive Media Project.
 *
 * Copyright (c) 2012 BBC, All Rights Reserved.
 * http://www.bbc.co.uk
 * The JavaScript client side code is available under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0.html
 * Please see the BBC R&D website for more details:
 * http://www.bbc.co.uk/rd/labs/ 
 *
 * Developed By: Happyworm Ltd http://www.happyworm.com
 * Author: Mark J Panaghiston @thepag
 * R&D: Mark Boas @maboa
 * Version: 1.0.0
 * Date: 2nd July 2012
 *
 * Animation JavaScript: BBC R&D UX&A
 */

/* Code verified using http://www.jshint.com/ */
/*jshint asi:false, bitwise:false, boss:false, browser:true, curly:false, debug:false, devel:false, eqeqeq:true, eqnull:false, evil:false, forin:false, immed:false, jquery:true, laxbreak:false, newcap:true, noarg:true, noempty:false, nonew:true, onevar:false, passfail:false, plusplus:false, regexp:false, undef:true, sub:false, strict:false, white:false smarttabs:true */
/*global PerceptiveMedia:false getCity:false getSocialNetworks:false initBreakingOut:false initLoadingMusic:false dat:false */

jQuery(document).ready(function ($) {

	var media_root = 'audio/',
	subHarrietID, subLiftID, subConciergeID, subSfxID;

	var power0Array = [
			[0,0,0,0,0,0,0], // 0
			[0,0,0,0,0,0,0], // 1
			[0,0,0,0,0,0,0], // 2
			[0,0,0,0,0,0,0], // 3
			[0,0,0,0,0,0,0], // 4
			[0,0,0,0,0,0,0], // 5
			[0,0,0,0,0,0,0], // 6
			[0,0,0,0,0,0,0], // 7
			[0,0,0,0,0,0,0], // 8
			[0,0,0,0,0,0,0]  // 9
		],
		power1Array = [
			[0,0,0,0,0,0,0], // 0
			[0,0,0,0,0,0,0], // 1
			[0,0,0,0,0,0,0], // 2
			[0,0,0,0,0,0,0], // 3
			[1,1,1,1,1,1,1], // 4
			[1,1,1,1,1,1,1], // 5
			[0,0,0,0,0,0,0], // 6
			[0,0,0,0,0,0,0], // 7
			[0,0,0,0,0,0,0], // 8
			[0,0,0,0,0,0,0]  // 9
		],
		power2Array = [
			[0,0,0,0,0,0,0], // 0
			[0,0,0,0,0,0,0], // 1
			[0,0,0,0,0,0,0], // 2
			[0,0,0,1,0,0,0], // 3
			[1,1,1,1,1,1,1], // 4
			[1,1,1,1,1,1,1], // 5
			[0,0,0,1,0,0,0], // 6
			[0,0,0,0,0,0,0], // 7
			[0,0,0,0,0,0,0], // 8
			[0,0,0,0,0,0,0]  // 9
		],
		power3Array = [
			[0,0,0,0,0,0,0], // 0
			[0,0,0,0,0,0,0], // 1
			[0,0,0,0,0,0,0], // 2
			[0,0,1,1,1,0,0], // 3
			[1,1,1,1,1,1,1], // 4
			[1,1,1,1,1,1,1], // 5
			[0,0,1,1,1,0,0], // 6
			[0,0,0,0,0,0,0], // 7
			[0,0,0,0,0,0,0], // 8
			[0,0,0,0,0,0,0]  // 9
		],
		power4Array = [
			[0,0,0,0,0,0,0], // 0
			[0,0,0,0,0,0,0], // 1
			[0,0,0,1,0,0,0], // 2
			[0,0,1,1,1,0,0], // 3
			[1,1,1,1,1,1,1], // 4
			[1,1,1,1,1,1,1], // 5
			[0,0,1,1,1,0,0], // 6
			[0,0,0,1,0,0,0], // 7
			[0,0,0,0,0,0,0], // 8
			[0,0,0,0,0,0,0]  // 9
		],
		power5Array = [
			[0,0,0,0,0,0,0], // 0
			[0,0,0,0,0,0,0], // 1
			[0,0,0,1,0,0,0], // 2
			[0,1,1,1,1,1,0], // 3
			[1,1,1,1,1,1,1], // 4
			[1,1,1,1,1,1,1], // 5
			[0,1,1,1,1,1,0], // 6
			[0,0,0,1,0,0,0], // 7
			[0,0,0,0,0,0,0], // 8
			[0,0,0,0,0,0,0]  // 9
		],
		power6Array = [
			[0,0,0,0,0,0,0], // 0
			[0,0,0,0,0,0,0], // 1
			[0,0,1,1,1,0,0], // 2
			[0,1,1,1,1,1,0], // 3
			[1,1,1,1,1,1,1], // 4
			[1,1,1,1,1,1,1], // 5
			[0,1,1,1,1,1,0], // 6
			[0,0,1,1,1,0,0], // 7
			[0,0,0,0,0,0,0], // 8
			[0,0,0,0,0,0,0]  // 9
		],
		power7Array = [
			[0,0,0,0,0,0,0], // 0
			[0,0,0,1,0,0,0], // 1
			[0,0,1,1,1,0,0], // 2
			[0,1,1,1,1,1,0], // 3
			[1,1,1,1,1,1,1], // 4
			[1,1,1,1,1,1,1], // 5
			[0,1,1,1,1,1,0], // 6
			[0,0,1,1,1,0,0], // 7
			[0,0,0,1,0,0,0], // 8
			[0,0,0,0,0,0,0]  // 9
		],
		power8Array = [
			[0,0,0,1,0,0,0], // 0
			[0,0,0,1,0,0,0], // 1
			[0,0,1,1,1,0,0], // 2
			[0,1,1,1,1,1,0], // 3
			[1,1,1,1,1,1,1], // 4
			[1,1,1,1,1,1,1], // 5
			[0,1,1,1,1,1,0], // 6
			[0,0,1,1,1,0,0], // 7
			[0,0,0,1,0,0,0], // 8
			[0,0,0,1,0,0,0]  // 9
		],
		power9Array = [
			[0,0,0,1,0,0,0], // 0
			[0,0,1,1,1,0,0], // 1
			[0,1,1,1,1,1,0], // 2
			[1,1,1,1,1,1,1], // 3
			[1,1,1,1,1,1,1], // 4
			[1,1,1,1,1,1,1], // 5
			[1,1,1,1,1,1,1], // 6
			[0,1,1,1,1,1,0], // 7
			[0,0,1,1,1,0,0], // 8
			[0,0,0,1,0,0,0]  // 9
		],
		power10Array = [
			[0,0,1,1,1,0,0], // 0
			[0,1,1,1,1,1,0], // 1
			[1,1,1,1,1,1,1], // 2
			[1,1,1,1,1,1,1], // 3
			[1,1,1,1,1,1,1], // 4
			[1,1,1,1,1,1,1], // 5
			[1,1,1,1,1,1,1], // 6
			[1,1,1,1,1,1,1], // 7
			[0,1,1,1,1,1,0], // 8
			[0,0,1,1,1,0,0]  // 9
		];

	var powerArrayList = [power0Array, power1Array, power2Array, power3Array, power4Array, power5Array, power6Array, power7Array, power8Array, power9Array, power10Array],
		currentPowerCount = 0,
		$pixel = [];

	var createLedElements = function() {
		var pxDelta = 0, xMultiplier = 13.5, yMultiplier = 13.5;

		var $pixelHolder = $('#voiceLeds');
			
		for(var y = 0; y < 10; y++) {
			for(var x = 0; x < 7; x++) {
				$pixel[x] = $pixel[x] || [];

				$pixel[x][y] = $("<img class='led' id='led"+x+"x"+y+"' src='./assets/img/audioplay_slide3_led.png'/>").css({"left":(x*xMultiplier)+pxDelta+"px", "top":(y*yMultiplier)+pxDelta+"px", "height": "12.5px", "width":"12.5px"});
				$pixelHolder.append($pixel[x][y]);
				//console.log("x: "+x+" y:"+y);
			}
		}
	};

	var setLedDisplayTo = function(inputPowerArray) {
	//    console.log(inputPowerArray);
		for(var y = 0; y < inputPowerArray.length; y++) {
			for(var x = 0; x < inputPowerArray[y].length; x++) {
				if(inputPowerArray[y][x] === 1) {
					$pixel[x][y].show();
				} else {
					$pixel[x][y].hide();
				}
			}
		}
	};

	$('#voiceLeds').hide();
	createLedElements();
	setLedDisplayTo(powerArrayList[0]);

	// See also, the ended event handler bound further down.
	$('#jplayerIntro').jPlayer({
		ready: function() {
			$(this).jPlayer('setMedia', {
				mp3: media_root + 'announcement/mp3/start-credits.mp3',
				oga: media_root + 'announcement/ogg/start-credits.ogg'
			});

			if(/(chrome|firefox|opera|safari)/i.test(navigator.userAgent)) {
				$('#startBanner').fadeIn("slow");
			} else {
				$('#tryAnywayBanner').fadeIn("slow");
			}
		},
		supplied: 'mp3,oga',
		swfPath: 'assets/js/jplayer',
		volume: 1
	});

	$('#js-subtitle-button-on').click(function() {
		$(this).hide();
		$('#js-subtitle-button-off').show();
		$('#js-subtitles').show();
	});

	$('#js-subtitle-button-off').click(function() {
		$(this).hide();
		$('#js-subtitle-button-on').show();
		$('#js-subtitles').hide();
	}).hide();

	$('#tryAnywayBanner').click(function() {
		$(this).fadeOut('slow');
		$('#startBanner').click();
	});

	$('#startBanner').click(function () {

		$('#js-page-entry').fadeOut("slow", function() {
			$('#js-page-intro').fadeIn('slow');
		});

		$('#startBanner').fadeOut("fast", function() {

			$('#jplayerIntro').jPlayer('play');
			$('#jplayerIntro').bind($.jPlayer.event.ended, function(){

				$('#js-page-intro').fadeOut('slow');
				$("#outsideLiftBackground").fadeTo("slow", 0, function () {
		
					$("#outsideLiftBackgroundImage").attr("src", "./assets/img/audioplay_slide2.png");
					$("#outsideLiftBackground").fadeTo("slow", 1, function () {
		
						$('#lift-dial-handle').show();

						var myLoader = initLoadingMusic();

						// if(/(chrome)/i.test(navigator.userAgent)) {
							$(myLoader).bind(PerceptiveMedia.prototype.event.ready, function () {
								myLoader.play(); // Auto-play the loader music.
							});
						// }
		
						getCity(function (geoData) {
		
							$('#js-geo-city').text(geoData.error ? geoData.errorMsg : geoData.city);
		
							getSocialNetworks(function (socialData) {
		
								$('#js-social-networks').text(socialData.error ? socialData.errorMsg + ' Using text: ' + socialData.text : socialData.text);
								$('#js-downloading').show();
		
								var myPM = initBreakingOut(geoData, socialData),
									gui_fine_time;
		
								$(myPM).bind(PerceptiveMedia.prototype.event.ready, function () {

									$('#js-easter-egg').show();

									$('#js-downloading').hide();
									$('#js-status').text('ready');
		
									var max_gain = {
										harriet:8,
										lift:1.2,
										concierge:8,
										sfx:8,
										music:1.6,
										ambient:8,
										radio:2.4,
										"tune-radio":2.4,
										weather:8
									};
		
									var updateAssets = function (value) {
										myPM.updateAssets(['master', 'branch']);
									};
									var updateTimings = function (value) {
										myPM.updateTimings(['master', 'branch']);
									};
									var updateDepthControl = function (value) {
										myPM.updateDepthControl();
									};
		
									// dat.GUI can only execute methods, it needs this wrapper to enable sending a time parameter to the method.
									var PlayFineControl = function () {
										this.time = 0;
										this.playAtTime = function () {
											myPM.play(this.time);
										};
									};
									var myPlayFineControl = new PlayFineControl();
		
									/* dat.GUI options... From inspecting code, as there is no reference doc... Only a few examples on how to use it.
									 *
									 * autoPlace : Boolean : (Default: true) : Documented in examples : Set to enable manual attachment to dom via gui.domElement.
									 * hideable : Boolean : (Defaults to autoPlace) : Enable the key 'h' to show and hide the GUI.
									 * scrollable : Boolean : Defaults to True when autoPlace is true... Otherwise it defaults to false.
									 * Some other options, but not sure what they do...
									 */
		
									// var gui = new dat.GUI({ autoPlace: false, scrollable: false });
									var gui = new dat.GUI({autoPlace:true, scrollable:true});
									$('#js-console').append(gui.domElement);
		
									var gui_controls = gui.addFolder('Controls');
									gui_controls.add(myPM, 'play');
									gui_controls.add(myPM, 'stop');
		
									// notice gui_fine_time scope here, as used in 2 handlers.
									var gui_fine_controls = gui_controls.addFolder('Fine Timing Controls');
									gui_fine_time = gui_fine_controls.add(myPlayFineControl, 'time', 0, myPM.duration);
									gui_fine_controls.add(myPlayFineControl, 'playAtTime');
		
									if (myPM.context) {
										var gui_depth_staging = gui.addFolder('Depth Staging: 0=fg, 1=bg');
										gui_depth_staging.add(myPM, 'depthControl', 0, 1).onChange(updateDepthControl);
		
										var gui_timeline_gap_styles = gui.addFolder('Timeline transaction gap');
										gui_timeline_gap_styles.add(myPM.tGap, 'master', -1, 2).onChange(updateTimings); // Or use: onFinishChange(updateTimings)
									}
		
									var gui_track_env_styles = gui.addFolder('Track / Environment Styles');
									var gui_track = {};
		
									// harriet
									gui_track.harriet = {
										gui:gui_track_env_styles.addFolder('harriet')
									};
		
									gui_track.harriet.flat = gui_track.harriet.gui.addFolder('flat');
									gui_track.harriet.flat.add(myPM.trackEnv.harriet.flat, 'bufferGain', 0, max_gain.harriet).onChange(updateAssets);
		
									gui_track.harriet.lift = gui_track.harriet.gui.addFolder('lift');
									gui_track.harriet.lift.add(myPM.trackEnv.harriet.lift, 'bufferGain', 0, max_gain.harriet).onChange(updateAssets);
									gui_track.harriet.lift.add(myPM.trackEnv.harriet.lift, 'effectGain', 0, max_gain.harriet).onChange(updateAssets);
		
									gui_track.harriet.lobby = gui_track.harriet.gui.addFolder('lobby');
									gui_track.harriet.lobby.add(myPM.trackEnv.harriet.lobby, 'bufferGain', 0, max_gain.harriet).onChange(updateAssets);
									gui_track.harriet.lobby.add(myPM.trackEnv.harriet.lobby, 'effectGain', 0, max_gain.harriet).onChange(updateAssets);
		
									// lift
									gui_track.lift = {
										gui:gui_track_env_styles.addFolder('lift')
									};
		
									gui_track.lift.flat = gui_track.lift.gui.addFolder('flat');
									gui_track.lift.flat.add(myPM.trackEnv.lift.flat, 'bufferGain', 0, max_gain.lift).onChange(updateAssets);
		
									gui_track.lift.lift = gui_track.lift.gui.addFolder('lift');
									gui_track.lift.lift.add(myPM.trackEnv.lift.lift, 'bufferGain', 0, max_gain.lift).onChange(updateAssets);
									gui_track.lift.lift.add(myPM.trackEnv.lift.lift, 'effectGain', 0, max_gain.lift).onChange(updateAssets);
		
									gui_track.lift.lobby = gui_track.lift.gui.addFolder('lobby');
									gui_track.lift.lobby.add(myPM.trackEnv.lift.lobby, 'bufferGain', 0, max_gain.lift).onChange(updateAssets);
									gui_track.lift.lobby.add(myPM.trackEnv.lift.lobby, 'effectGain', 0, max_gain.lift).onChange(updateAssets);
		
									// concierge
									gui_track.concierge = {
										gui:gui_track_env_styles.addFolder('concierge')
									};
		
									gui_track.concierge.lift = gui_track.concierge.gui.addFolder('lift');
									gui_track.concierge.lift.add(myPM.trackEnv.concierge.lift, 'bufferGain', 0, max_gain.concierge).onChange(updateAssets);
									gui_track.concierge.lift.add(myPM.trackEnv.concierge.lift, 'effectGain', 0, max_gain.concierge).onChange(updateAssets);
		
									gui_track.concierge.lobby = gui_track.concierge.gui.addFolder('lobby');
									gui_track.concierge.lobby.add(myPM.trackEnv.concierge.lobby, 'bufferGain', 0, max_gain.concierge).onChange(updateAssets);
									gui_track.concierge.lobby.add(myPM.trackEnv.concierge.lobby, 'effectGain', 0, max_gain.concierge).onChange(updateAssets);
		
									// sfx
									gui_track.sfx = {
										gui:gui_track_env_styles.addFolder('sfx')
									};
		
									gui_track.sfx.flat = gui_track.sfx.gui.addFolder('flat');
									gui_track.sfx.flat.add(myPM.trackEnv.sfx.flat, 'bufferGain', 0, max_gain.sfx).onChange(updateAssets);
		
									gui_track.sfx.lift = gui_track.sfx.gui.addFolder('lift');
									gui_track.sfx.lift.add(myPM.trackEnv.sfx.lift, 'bufferGain', 0, max_gain.sfx).onChange(updateAssets);
									gui_track.sfx.lift.add(myPM.trackEnv.sfx.lift, 'effectGain', 0, max_gain.sfx).onChange(updateAssets);
		
									gui_track.sfx.lobby = gui_track.sfx.gui.addFolder('lobby');
									gui_track.sfx.lobby.add(myPM.trackEnv.sfx.lobby, 'bufferGain', 0, max_gain.sfx).onChange(updateAssets);
									gui_track.sfx.lobby.add(myPM.trackEnv.sfx.lobby, 'effectGain', 0, max_gain.sfx).onChange(updateAssets);
		
									// music
									gui_track.music = {
										gui:gui_track_env_styles.addFolder('music')
									};
		
									gui_track.music.flat = gui_track.music.gui.addFolder('flat');
									gui_track.music.flat.add(myPM.trackEnv.music.flat, 'bufferGain', 0, max_gain.music).onChange(updateAssets);
									gui_track.music.flat.add(myPM.trackEnv.music.flat, 'bufferFilterGain', 0, max_gain.music).onChange(updateAssets);
		
									gui_track.music.lobby = gui_track.music.gui.addFolder('lobby');
									gui_track.music.lobby.add(myPM.trackEnv.music.lobby, 'bufferGain', 0, max_gain.music).onChange(updateAssets);
									gui_track.music.lobby.add(myPM.trackEnv.music.lobby, 'effectGain', 0, max_gain.music).onChange(updateAssets);
									gui_track.music.lobby.add(myPM.trackEnv.music.lobby, 'bufferFilterGain', 0, max_gain.music).onChange(updateAssets);
									gui_track.music.lobby.add(myPM.trackEnv.music.lobby, 'effectFilterGain', 0, max_gain.music).onChange(updateAssets);
		
									// ambient
									gui_track.ambient = {
										gui:gui_track_env_styles.addFolder('ambient')
									};
		
									gui_track.ambient.lift = gui_track.ambient.gui.addFolder('lift');
									gui_track.ambient.lift.add(myPM.trackEnv.ambient.lift, 'bufferGain', 0, max_gain.ambient).onChange(updateAssets);
									gui_track.ambient.lift.add(myPM.trackEnv.ambient.lift, 'effectGain', 0, max_gain.ambient).onChange(updateAssets);
		
									// radio
									gui_track.radio = {
										gui:gui_track_env_styles.addFolder('radio')
									};
		
									gui_track.radio.lift = gui_track.radio.gui.addFolder('lift');
									gui_track.radio.lift.add(myPM.trackEnv.radio.lift, 'bufferGain', 0, max_gain.radio).onChange(updateAssets);
									gui_track.radio.lift.add(myPM.trackEnv.radio.lift, 'effectGain', 0, max_gain.radio).onChange(updateAssets);
									gui_track.radio.lift.add(myPM.trackEnv.radio.lift, 'bufferFilterGain', 0, max_gain.radio).onChange(updateAssets);
									gui_track.radio.lift.add(myPM.trackEnv.radio.lift, 'effectFilterGain', 0, max_gain.radio).onChange(updateAssets);
		
									// tune-radio
									gui_track['tune-radio'] = {
										gui:gui_track_env_styles.addFolder('tune-radio')
									};
		
									gui_track['tune-radio'].lift = gui_track['tune-radio'].gui.addFolder('lift');
									gui_track['tune-radio'].lift.add(myPM.trackEnv['tune-radio'].lift, 'bufferGain', 0, max_gain['tune-radio']).onChange(updateAssets);
									gui_track['tune-radio'].lift.add(myPM.trackEnv['tune-radio'].lift, 'effectGain', 0, max_gain['tune-radio']).onChange(updateAssets);
									gui_track['tune-radio'].lift.add(myPM.trackEnv['tune-radio'].lift, 'bufferFilterGain', 0, max_gain['tune-radio']).onChange(updateAssets);
									gui_track['tune-radio'].lift.add(myPM.trackEnv['tune-radio'].lift, 'effectFilterGain', 0, max_gain['tune-radio']).onChange(updateAssets);
		
									// weather
									gui_track.weather = {
										gui:gui_track_env_styles.addFolder('weather')
									};
		
									gui_track.weather.lobby = gui_track.weather.gui.addFolder('lobby');
									gui_track.weather.lobby.add(myPM.trackEnv.weather.lobby, 'bufferGain', 0, max_gain.weather).onChange(updateAssets);
									gui_track.weather.lobby.add(myPM.trackEnv.weather.lobby, 'effectGain', 0, max_gain.weather).onChange(updateAssets);
									gui_track.weather.lobby.add(myPM.trackEnv.weather.lobby, 'bufferFilterGain', 0, max_gain.weather).onChange(updateAssets);
									gui_track.weather.lobby.add(myPM.trackEnv.weather.lobby, 'effectFilterGain', 0, max_gain.weather).onChange(updateAssets);
		
									if (myPM.context) {
										var gui_fader_styles = gui.addFolder('Fader Styles');
										var gui_fader = {};
										var addFaderGui = function (fader) {
											gui_fader[fader] = {
												gui:gui_fader_styles.addFolder(fader)
											};
											for (var i = 0, iLen = myPM.faderStyle[fader].length; i < iLen; i++) {
												gui_fader[fader]['t' + i] = gui_fader[fader].gui.addFolder('time point: ' + i);
												gui_fader[fader]['t' + i].add(myPM.faderStyle[fader][i], 'bufferRatio', 0, 1).onChange(updateAssets);
												gui_fader[fader]['t' + i].add(myPM.faderStyle[fader][i], 'effectRatio', 0, 1).onChange(updateAssets);
												gui_fader[fader]['t' + i].add(myPM.faderStyle[fader][i], 'bufferFilterRatio', 0, 1).onChange(updateAssets);
												gui_fader[fader]['t' + i].add(myPM.faderStyle[fader][i], 'effectFilterRatio', 0, 1).onChange(updateAssets);
											}
										};
										addFaderGui('flat-music');
										addFaderGui('lift-first-move');
										addFaderGui('lift-ambient');
										addFaderGui('tune-radio');
										addFaderGui('radio');
										addFaderGui('lobby-music');
		
										var gui_filter_styles = gui.addFolder('Filter Styles');
										var gui_filter = {};
										var addFilterGui = function (filter) {
											gui_filter[filter] = gui_filter_styles.addFolder(filter);
											gui_filter[filter].add(myPM.filterStyle[filter], 'type', {Lowpass:0, Highpass:1, Bandpass:2, Lowshelf:3, Highshelf:4, Peaking:5, Notch:6, Allpass:7}).onChange(updateAssets);
											gui_filter[filter].add(myPM.filterStyle[filter], 'frequency', 0, 20000).onChange(updateAssets);
											gui_filter[filter].add(myPM.filterStyle[filter], 'Q', 0.1, 20).onChange(updateAssets); // The Web Audio API dies if Q=0
											gui_filter[filter].add(myPM.filterStyle[filter], 'gain', 0, 10).onChange(updateAssets);
										};
										addFilterGui('muffled');
										addFilterGui('radio');
									}

									// myPM.play(); // Auto-play the story.
		
									// Enable the console.
									$('#js-easter-egg').click(function () {
										$(this).parent().removeClass('easter-egg-hidden');
										$('#js-easter-bunny').toggle();
									}).show();

									// Get the loader's loop offset and then play the story from it... So they are in synch.
									var startOffset = -myLoader.assets.loader[0].getGrainRemaining(); // Shedules a noteOff on loader for when story starts.
									$('#js-start-offset').text(startOffset);
									myPM.play(startOffset); // Auto-play the story.
		
								});
		
								$(myPM).bind(PerceptiveMedia.prototype.event.timingupdate, function () {
									gui_fine_time.max(myPM.duration);
									gui_fine_time.updateDisplay();
								});
		
								// The track POWER bits & bobs.
		
								var trackPowerPeriod = 1000 / 10, // 10Hz
		
									powerIndicator = function (power) {
										power = power < 0 ? 0 : (power > 1 ? 1 : power); // limit the input to ratio 0 to 1.
										power = Math.round(power * 10);
		
										power = ((power > 10) ? 10 : power);
										power = ((power < 0) ? 0 : power);
		
										//console.log(power);
										setLedDisplayTo(powerArrayList[power]);
		
									},
									trackPowerID,
									trackPower = function () {
										var liftPower = myPM.getTrackPower('lift');
		
		
										// boost the value a bit? Using 5 x the power ratio value.
										powerIndicator(liftPower * 5);
		
										trackPowerID = setTimeout(trackPower, trackPowerPeriod);
									};
		
								// The track power stuff is currently turned on and off using the play/stop events.
								// In practice, I expect that a playasset event would be used to start and stop this when desired in the storyline.
								// NB: Since it would be hidden, all you do is save CPU power while it is hidden as noone would ever know. Well, unless they looked at the code.
		
								$(myPM).bind(PerceptiveMedia.prototype.event.play, function () {
									$('#js-status').text('playing');
		
								});
		
								$(myPM).bind(PerceptiveMedia.prototype.event.stop, function () {
									$('#js-status').text('stopped');
								});
		
								// This event handler is fired while the assets load
								$(myPM).bind(PerceptiveMedia.prototype.event.progress, function (event) {
									$('#js-progress-loaded').text(event.pmedia.status.assetsLoaded);
									$('#js-progress-total').text(event.pmedia.status.assetsTotal);
									$('#js-progress-buffered').text(event.pmedia.status.buffered);
		
									// Fade the filter in and then fade in the normal sound while fading out the filter.
									myLoader.assets.loader[0].bufferGain = event.pmedia.status.buffered > 0.5 ? ((event.pmedia.status.buffered - 0.5) / 0.5) * myPM.trackEnv.music.flat.bufferGain : 0;
									myLoader.assets.loader[0].bufferFilterGain = event.pmedia.status.buffered < 0.5 ? (event.pmedia.status.buffered / 0.5) * myPM.trackEnv.music.flat.bufferGain : ((1 - event.pmedia.status.buffered) / 0.5) * myPM.trackEnv.music.flat.bufferGain;
									myLoader.assets.loader[0].applyGains();
		
									$('#js-stage .stage-background').css({'opacity':event.pmedia.status.buffered});
									//$('#js-stage .lift-dial-hand').css({ 'transform-origin': '10px 10px'});
									$('#js-stage .lift-dial-hand').css({'transform':'rotate(' + (event.pmedia.status.buffered * 180) + 'deg)'});
								});
		
								$(myPM).bind(PerceptiveMedia.prototype.event.playasset, function (event) {
/*
									$('#js-playasset-subtitle').text(event.pmedia.asset.subtitle);
									$('#js-playasset-text').text(event.pmedia.asset.text);
									$('#js-playasset-track').text(event.pmedia.asset.track);
									$('#js-playasset-id').text(event.pmedia.asset.id || '');
*/		
									// Example of making the voice subtitles appear in different places.
									if (event.pmedia.asset.track === 'harriet') {
										$('#js-sub-harriet').text(event.pmedia.asset.subtitle).parent().show();
										clearTimeout(subHarrietID);
										subHarrietID = setTimeout(function() {
											$('#js-sub-harriet').parent().hide();
										}, event.pmedia.asset.duration * 1000);
									} else if (event.pmedia.asset.track === 'lift') {
										$('#js-sub-lift').text(event.pmedia.asset.subtitle).parent().show();
										clearTimeout(subLiftID);
										subLiftID = setTimeout(function() {
											$('#js-sub-lift').parent().hide();
										}, event.pmedia.asset.duration * 1000);
									} else if (event.pmedia.asset.track === 'concierge') {
										$('#js-sub-concierge').text(event.pmedia.asset.subtitle).parent().show();
										clearTimeout(subConciergeID);
										subConciergeID = setTimeout(function() {
											$('#js-sub-concierge').parent().hide();
										}, event.pmedia.asset.duration * 1000);
									} else if (event.pmedia.asset.track === 'sfx') {
										$('#js-sub-sfx').text(event.pmedia.asset.subtitle).parent().show();
										clearTimeout(subSfxID);
										subSfxID = setTimeout(function() {
											$('#js-sub-sfx').parent().hide();
										}, event.pmedia.asset.duration * 1000);
									}
		
									// NB: The branch assets play first, and then the master timeline assets.
		
									if (event.pmedia.asset.id === 'the-start') {
										$("#outsideLiftBackground").stop(true, true).fadeTo(0, 1);
										$("#outsideLiftBackgroundImage").attr("src", "./assets/img/audioplay_slide2.png");
										$('#lift-dial-handle').stop(true, true).css({'transform':'rotate(180deg)'}).fadeIn(0); // The 6th floor is the initial point, after using it as the loader.
										$("#arrowDownLedsImage").hide();
										$('#voiceLeds').hide();
										$("#js-page-credits").hide();
										$("#endBanner").hide();
									} else if (event.pmedia.asset.id === 'call-lift') {
										$('#lift-dial-handle').stop(true, true).animate({'transform':'rotate(150deg)'}, 4000); // The 5th floor. (Harriest's flat is on this floor.)
									} else if (event.pmedia.asset.id === 'lift-open-5th') {
										$("#lift-dial-handle").stop(true, true).fadeOut("slow");
										$("#outsideLiftBackground").stop(true, true).fadeTo("slow", 0, function () {
											$("#outsideLiftBackgroundImage").attr("src", "./assets/img/audioplay_slide3.png");
										});
									} else if (event.pmedia.asset.id === 'lift-closes-5th') {
										$("#outsideLiftBackground").stop(true, true).fadeTo("slow", 1, function () {
											$('#voiceLeds').show();
											clearTimeout(trackPowerID);
											trackPowerID = setTimeout(trackPower, trackPowerPeriod);
										});
									} else if (event.pmedia.asset.id === 'lift-starts') {
										$("#arrowDownLedsImage").show();
									} else if (event.pmedia.asset.id === 'lift-halts') {
										$("#arrowDownLedsImage").hide();
									} else if (event.pmedia.asset.id === 'lift-starts-down-again-1') {
										$("#arrowDownLedsImage").show();
									} else if (event.pmedia.asset.id === 'harriet-stops-lift') {
										$("#arrowDownLedsImage").hide();
									} else if (event.pmedia.asset.id === 'lift-starts-down-again-2') {
										$("#arrowDownLedsImage").show();
									} else if (event.pmedia.asset.id === 'lift-stops-at-2nd') {
										$("#arrowDownLedsImage").hide();
									} else if (event.pmedia.asset.id === 'harriet-pushes-button-to-go-down-1') {
										$("#arrowDownLedsImage").show();
									} else if (event.pmedia.asset.id === 'lift-arrives-at-1st') {
										$("#arrowDownLedsImage").hide();
									} else if (event.pmedia.asset.id === 'harriet-pushes-button-to-go-down-2') {
										$("#arrowDownLedsImage").show();
									} else if (event.pmedia.asset.id === 'lift-arrives-at-ground') {
										$("#arrowDownLedsImage").hide();
									} else if (event.pmedia.asset.id === 'lift-doors-open-on-ground') {
										$("#voiceLeds").hide();
										clearTimeout(trackPowerID);
										$("#outsideLiftBackground").stop(true, true).fadeTo("slow", 0, function () {
											$("#outsideLiftBackgroundImage").attr("src", "./assets/img/audioplay_slide4.png");
										});
									} else if (event.pmedia.asset.id === 'lift-ambient-end') {
										$("#outsideLiftBackground").stop(true, true).fadeTo("slow", 1);
		
									} else if (event.pmedia.asset.id === 'end-credits') {
										$("#outsideLiftBackground").stop(true, true).fadeTo("slow", 0, function () {
											$("#outsideLiftBackgroundImage").attr("src", "./assets/img/audioplay_slide1.png");
											$("#js-page-credits").show();
											$("#endBanner").show();
											$("#outsideLiftBackground").fadeTo("slow", 1);
										});
									}
								});
							});
						});
					});
				});
			});
		});
	});
});