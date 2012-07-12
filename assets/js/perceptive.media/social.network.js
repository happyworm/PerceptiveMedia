/*
 * Social Networks JavaScript Library.
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
/*global */

var setSocialNetworks, getSocialNetworks = (function($, undefined) {

	// See index.html head for script insertions.

	var socialData = {},
	social, forceReady, forceID, callback;

	if($.browser.msie && $.browser.version <= 9) {
		social = {
			gmail: false
		};
	} else {
		social = {
			facebook: false,
			twitter: false,
			digg: false,
			gmail: false
		};
	}

	function ready() {
		var readyCheck = true,
		text = '';
		for(var socialType in social) {
			if(social.hasOwnProperty(socialType)) {
				readyCheck &= social[socialType];
				text += socialData[socialType] ? socialType + ',' : '';
			}
		}
		if(readyCheck || forceReady) {
			clearTimeout(forceID); // To cancel timeout under normal operation.
			if(!text) {
				text = 'your computer';
				socialData.error = true;
				socialData.errorMsg = 'No social network logins found.';
			} else {
				text = text.slice(0, -1); // Remove the last comma.
				var textArr = text.split(','); // Split up (single word) network names and remove commas.
				if(textArr.length >  1) {
					textArr.splice(-1, 0, 'and'); // Add 'and' between the last 2 words
				}
				for(var i = 0, iLen = textArr.length - 3; i < iLen; i++) {
					textArr[i] += ','; // Add the commas back into the start of the list.
				}
				text = textArr.join(' ');
			}
			socialData.text = text;
			if(callback) setTimeout(function() { callback(socialData); }, 0);
		} else {
			clearTimeout(forceID);
			forceID = setTimeout(function() {
				forceReady = true;
				ready();
			}, 10000);
		}
	}

	setSocialNetworks = function(network, loggedin) {
		// console.log('socialData[' + network + '] = ' + loggedin);
		socialData[network] = loggedin;
		social[network] = true;
		ready();
	};

	return function(_callback) {
		callback = _callback;

		$('<img/>').hide()
		.attr('src','https://mail.google.com/mail/u/0/photos/img/photos/public/AIbEiAIAAABECNT4p9miyrnd_gEiC3ZjYXJkX3Bob3RvKigzYzZhN2MyYmVlZWExZjMyNjMxODhiNmMxYTczNmMzYTdiNzk4YmI5MAEVKdRq3UOmbJN8hAPXt11kXX0uDA')
		.load(function() {
			setSocialNetworks('gmail', true);
		}).error(function() {
			setSocialNetworks('gmail', false);
		}).appendTo('body');
	};
})(jQuery);
/*
jQuery(document).ready(function($) {
	getSocialNetworks(function(socialData) {
		console.log('socialData:');
		console.dir(socialData);
	});
});
*/