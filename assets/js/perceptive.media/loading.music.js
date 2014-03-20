/*
 * Loading Music using the Perceptive Media JavaScript Library.
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
 */

/* Code verified using http://www.jshint.com/ */
/*jshint asi:false, bitwise:false, boss:false, browser:true, curly:false, debug:false, devel:false, eqeqeq:true, eqnull:false, evil:false, forin:false, immed:false, jquery:true, laxbreak:false, newcap:true, noarg:true, noempty:false, nonew:true, onevar:false, passfail:false, plusplus:false, regexp:false, undef:true, sub:false, strict:false, white:false smarttabs:true */
/*global PerceptiveMedia:false dateFormat:false */

var initLoadingMusic = (function($, undefined) {

	var media_root = 'audio/';

	return function() {

		var loader = [
			{
				id: 'loader',
				track: 'music',
				env: 'flat',
				text: "(Loading music)",
				url: media_root + 'music/#FMT#/music-loop-x2.#FMT#',
				loop: true,
				duration: 3600, // Number.POSITIVE_INFINITY,
				noDuration: true, // To fix the noteOff bug
				rel: 'start', // Otherwise the timeGap is applied here.
				filterStyle: 'muffled'
			}
		];

		// Create the Perceptive Media instance.
		var myPM = new PerceptiveMedia();

		// Setup the Track and Environment styles.
		myPM.setTrackEnv('music', 'flat', {
			// effect:0,
			bufferGain: 0,
			effectGain: 0,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'background'
		});

		// Adding this as a dummy style, otherwise the volume normalization screws up.
		myPM.setTrackEnv('harriet', 'flat', {
			// effect:1,
			bufferGain: 2,
			effectGain: 0,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});

		// Filter Styles

		myPM.setFilter('muffled', {
			type: 0, // Lowpass
			frequency: 200,
			Q: 2,
			gain: 0
		});

		// Set the total number of assets to be loaded
		myPM.setTotalAssets(loader.length);

		// And now prepare the chunks in the order they are used. Required to enable relative timing system.

		myPM.appendTimeline('loader', loader, [{time:0,tEnd:0}], function(group) {
			myPM.enable();
		});

		return myPM;
	};
})(jQuery);

// jQuery(document).ready(function($) {
	// initBreakingOut({city:"Edinburgh"});
// });
