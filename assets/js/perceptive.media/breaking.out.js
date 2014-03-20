/*
 * Breaking Out scene using the Perceptive Media JavaScript Library.
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
 * Script Title: Breaking out
 * Script Author: Sarah Glenister @sarahglenister
 *
 * Animation JavaScript: BBC R&D UX&A
 */

/* Code verified using http://www.jshint.com/ */
/*jshint asi:false, bitwise:false, boss:false, browser:true, curly:false, debug:false, devel:false, eqeqeq:true, eqnull:false, evil:false, forin:false, immed:false, jquery:true, laxbreak:false, newcap:true, noarg:true, noempty:false, nonew:true, onevar:false, passfail:false, plusplus:false, regexp:false, undef:true, sub:false, strict:false, white:false smarttabs:true */
/*global PerceptiveMedia:false dateFormat:false */

var initBreakingOut = (function($, undefined) {

	return function(geoData, socialData) {

		var media_root = 'audio/';


		// console.log('geoData:');
		// console.dir(geoData);
		// console.log('socialData:');
		// console.dir(socialData);

/*
		// Docs for the geoData and socialData objects

		// Dynamic content based on geolocation.
		geoData = {
			city: String default: "your city",
			longitude: Number,
			latitude: Number,
			error: Boolean,
			errorMsg: String,
			news: {
				rss: 'proxy_url',
				url: [], // Array of podcast urls
				error: Boolean,
				errorMsg: String
			}
			movies: {
				rss: 'proxy_url',
				all: [], // Array of movie titles
				comedy: [], // Array of movie titles
				horror: [], // Array of movie titles
				error: Boolean,
				errorMsg: String
			}
			attraction: [], // Array of attractions
			eat: [], // Array of places to eat
			drink: [], // Array of places to drink
			weather: {
				rss: 'proxy_url',
				sunny: [], // Array of booleans from today into future. ie., sunny[0] is true when it is sunny today. sunny[1] is for tomorrow.
				error: Boolean,
				errorMsg: String
			}
		}

		// Dynamic content based on social networks.
		socialData = {
			gmail: Boolean,
			facebook: Boolean,
			twitter: Boolean,
			digg: Boolean,
			text: String // A handy string listing the logged in networks, formated as a sentence snippet. ie., a, b and c. a and b. Or just a.
		}
*/

		// Using date formater from: http://blog.stevenlevithan.com/archives/date-time-format

		var timeNow = new Date(),
		dateData = {
			date: dateFormat(timeNow, "mmmm dS"),
			day: dateFormat(timeNow, "dddd"),
			month: dateFormat(timeNow, "mmmm"),
			year: dateFormat(timeNow, "yyyy"),
			fulldate: dateFormat(timeNow, "dddd, mmmm dS, yyyy")
		};

		// Notes: Change effects to an object?
		// Notes: could then name the prop as the env name.

		// Define the effect Impulse Responses.
		var effect = [
			{
				text: "Lobby Environment",
				url: media_root + 'effects/#FMT#/lobby_impulse.#FMT#'
			}, {
				text: "Lift Environment",
				url: media_root + 'effects/#FMT#/lift_impulse.#FMT#'
			}
		];


/*
			// Format of the Timeline entity object.
			{
				id: 'id', // Optional unique ID for this asset. Branches use IDs to relate their timings to a timeline.

				track: 'track name', // For gain/effect style map
				env: 'Environment name', // For gain/effect style map
				text: "TEXT", // The script or description of sound.
				subtitle: "TEXT", // Optional: English version of text without phonetics. Only used where speech generated.

				url: media_root + 'harriet/#FMT#/h1.#FMT#', // Optional: If undefined, the text speech is generated.
				mp3: 'url' // Optional: An external MP3 resource. Given instead of URL template.
				loop: true, // Optional: Causes the sound to loop. If used, tEndId required. Also causes WAV to be used.

				tRel: 42, // Optional: Default 0. Fine control of item's relative timings
				rel: 'start', // Optional: Relative to the end time (default) or to the start time of the relative. (When rel:'start' the timeline time-gap is not applied.)
				noGap: true, // Optional: To remove the time gap insertion to relative end timings.

				duration: 42, // Otional: Specify the duration of the media to play. Can be used to make loops play automatically for T time. Normally the duration is auto read in from audio.
				forceDuration: true, // Optional: (Default: false) Causes the audio to stop at the duration time.
				noduration: true, // Optional: (Default: false) Use with a duration on loops to avoid multi noteOff() bug

				fader: [
					{
						rel: 'end' // Optional: Relative to the start time (default) or to the end time of itself.
						tRel: 3 // Optional: Default 0. Fine control of item's relative timing
					}
				]

				filterStyle: 'muffled' // Optional: The filter style to use.
*/

		var tInitialMusicIntro = 3; // The loader synch can add up to 1 loop length onto the auto-play... So made this smaller. Affects reply from the console.

		var master = [
			{
				id: 'master-start',
				track: 'sfx',
				env: 'flat',
				text: "(Harriet opens her door)",
				url: media_root + 'sfx/#FMT#/sfx-1-open-flat-door.#FMT#',
				rel: 'start', // Otherwise the timeGap is applied here.
				// tRel: 6 // Added 6 on to start so music has time to play. The music has the identical, but minus timing.
				tRel: tInitialMusicIntro // See the first music branch, which has minus this timing. Hence the var.
			},
			{
				track: 'harriet',
				env: 'flat',
				text: "Ok, I can do this...",
				url: media_root + 'harriet/#FMT#/h1.#FMT#'
			},
			{
				id: 'flat-door',
				track: 'sfx',
				env: 'flat',
				text: "(Harriet closes her door)",
				url: media_root + 'sfx/#FMT#/sfx-2-close-flat-door.#FMT#'
				// noGap: true
			},
			{
				track: 'sfx',
				env: 'flat',
				text: "(Harriet walks to lift)",
				url: media_root + 'sfx/#FMT#/sfx-3-walking.#FMT#'
			},
			{
				id: 'call-lift',
				track: 'sfx',
				env: 'flat',
				text: "(Harriet presses lift button)",
				url: media_root + 'sfx/#FMT#/sfx-4-lift-button.#FMT#',
				tRel: 1,
				noGap: true
			},
			{
				track: 'harriet',
				env: 'flat',
				text: "Come on, come on, come on...",
				url: media_root + 'harriet/#FMT#/h2.#FMT#',
				tRel: 1,
				noGap: true
			},
			{
				track: 'sfx',
				env: 'flat',
				text: "(The lift dings)",
				url: media_root + 'sfx/#FMT#/sfx-5-lift-bell.#FMT#'
			},
			{
				track: 'lift',
				env: 'flat',
				text: "Doors opening.",
				url: media_root + 'lift/#FMT#/l1.#FMT#'
			},
			{
                id: 'lift-open-5th',
				track: 'sfx',
				env: 'flat',
				text: "(The doors open)",
				url: media_root + 'sfx/#FMT#/sfx-6-lift-door-open.#FMT#'
				// rel: 'start',
				// tRel: 1
			},
			{
				id: 'lift-ambient-start',
				track: 'sfx',
				env: 'lift',
				text: "(Harriet enters lift)",
				url: media_root + 'sfx/#FMT#/sfx-7-walking.#FMT#'
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(Harriet presses ground floor)",
				url: media_root + 'sfx/#FMT#/sfx-8-lift-button.#FMT#',
				tRel: 1,
				noGap: true
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Doors closing.",
				url: media_root + 'lift/#FMT#/l2.#FMT#',
				tRel: 1,
				noGap: true
			},
			{
                id: 'lift-closes-5th',
				track: 'sfx',
				env: 'lift',
				text: "(The doors close)",
				url: media_root + 'sfx/#FMT#/sfx-9-lift-door-close.#FMT#'
				// rel: 'start', // REVIEW
				// tRel: 1
			},
			{
				id: 'lift-starts',
				track: 'lift',
				env: 'lift',
				text: "Lift going down.",
				url: media_root + 'lift/#FMT#/l2a.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "I can do this, I can do this...",
				url: media_root + 'harriet/#FMT#/h3.#FMT#',
				tRel: 1
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Oh God, no, no, I can't do this!",
				url: media_root + 'harriet/#FMT#/h3a.#FMT#',
				tRel: 2,
				noGap: true
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(Harriet hits the lift buttons)",
				url: media_root + 'sfx/#FMT#/sfx-11-lift-button-hitting.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Stop! Stop! I can't do this! Stop!",
				url: media_root + 'harriet/#FMT#/h4.#FMT#',
				rel: 'start',
				tRel: 2
			},
			{
				id: 'lift-halts',
				track: 'sfx',
				env: 'lift',
				text: "(The lift grinds to a halt)",
				url: media_root + 'sfx/#FMT#/sfx-12-lift-grind-halt.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "(sighs with relief)",
				url: media_root + 'harriet/#FMT#/h5.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Ok, up.",
				url: media_root + 'harriet/#FMT#/h6.#FMT#'
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(Harriet presses a button)",
				url: media_root + 'sfx/#FMT#/sfx-13-lift-button.#FMT#'
			},
			// (nothing happens)
			{
				track: 'sfx',
				env: 'lift',
				text: "(Harriet presses again)",
				url: media_root + 'sfx/#FMT#/sfx-14-lift-button.#FMT#',
				tRel: 1
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Up!",
				url: media_root + 'harriet/#FMT#/h7.#FMT#'
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(Harriet jabs at buttons)",
				url: media_root + 'sfx/#FMT#/sfx-15-lift-button-jabbing.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Up! Up! Up!",
				url: media_root + 'harriet/#FMT#/h8.#FMT#',
				rel: 'start'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Ow!",
				url: media_root + 'harriet/#FMT#/h9.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Ouch!", // The lift saying "Ow!" sounded like Oh and was lame.
				url: media_root + 'lift/#FMT#/l2b.#FMT#',
				rel: 'start',
				tRel: 0
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "You stupid machine!",
				url: media_root + 'harriet/#FMT#/h10.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Charming!",
				url: media_root + 'lift/#FMT#/l3.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "What...?",
				url: media_root + 'harriet/#FMT#/h11.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "I'm trying my best.",
				url: media_root + 'lift/#FMT#/l4.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Oh great, now I'm hearing voices. As if I wasn't mad enough.",
				url: media_root + 'harriet/#FMT#/h12.#FMT#'
			},
/*
			{
				track: 'lift',
				env: 'lift',
				text: "You're mad?",
				url: media_root + 'lift/#FMT#/l5.#FMT#'
			},
*/
			{
				track: 'harriet',
				env: 'lift',
				text: "Ok, calm down, Harriet, you can get out.",
				url: media_root + 'harriet/#FMT#/h13.#FMT#',
				tRel: 2
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(Harriet presses the emergency call button)",
				url: media_root + 'sfx/#FMT#/sfx-16-emergency-button.#FMT#'
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(The call rings)",
				url: media_root + 'sfx/#FMT#/sfx-17-emergency-ringing.#FMT#' // REVIEW
			},
			{
				track: 'concierge',
				env: 'lift',
				text: "Hello?",
				url: media_root + 'concierge/#FMT#/c1.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "I'm stuck in the lift near the third floor, can you get me out, please? Quickly?",
				url: media_root + 'harriet/#FMT#/h14.#FMT#'
			},
			{
				track: 'concierge',
				env: 'lift',
				text: "My Engineers will be a few minutes.",
				url: media_root + 'concierge/#FMT#/c2.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Ok could you...?",
				url: media_root + 'harriet/#FMT#/h15.#FMT#'
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(The concierge hangs up)",
				url: media_root + 'sfx/#FMT#/sfx-18-emergency-hangup.#FMT#',
				noGap: true,
				tRel: -1
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(The line does dead)",
				url: media_root + 'sfx/#FMT#/sfx-19-emergency-hangup-tone.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "...stay? ...Cheers for that.",
				url: media_root + 'harriet/#FMT#/h16.#FMT#',
				rel: 'start'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "You don't seem mad.",
				url: media_root + 'lift/#FMT#/l6.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Perfectly normal, I just can't leave my flat and I discuss psychology with lifts.",
				url: media_root + 'harriet/#FMT#/h17.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "You have left your flat.",
				url: media_root + 'lift/#FMT#/l7.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "And look where that got me. I can't breathe and my heart's going to explode.",
				url: media_root + 'harriet/#FMT#/h18.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "That's unfortunate.",
				url: media_root + 'lift/#FMT#/l8.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Unfortunate?!",
				url: media_root + 'harriet/#FMT#/h19.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Don't explode.",
				url: media_root + 'lift/#FMT#/l9.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "I was being figurative.",
				url: media_root + 'harriet/#FMT#/h20.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "You're being irrational.",
				url: media_root + 'lift/#FMT#/l10.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Look, I'm really panicking, ok? I need to get out of here.",
				url: media_root + 'harriet/#FMT#/h21.#FMT#'
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(The lift bell rings)",
				url: media_root + 'sfx/#FMT#/sfx-20-lift-bell.#FMT#'
			},
			{
                id: 'lift-starts-down-again-1',
				track: 'lift',
				env: 'lift',
				text: "Lift going down.",
				url: media_root + 'lift/#FMT#/l11.#FMT#',
				rel: 'start'
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(Harriet slams the lift buttons)",
				url: media_root + 'sfx/#FMT#/sfx-21-lift-button-slam.#FMT#'
			},
			{
                id: 'harriet-stops-lift',
				track: 'harriet',
				env: 'lift',
				text: "No don't go down! Take me home!",
				url: media_root + 'harriet/#FMT#/h22.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "It's nicer on the ground floor. There's a vending machine.",
				url: media_root + 'lift/#FMT#/l12.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "It's less terrifying at home. I've got candles and paper lanterns and a bottle of wine... I could be relaxing right now.",
				url: media_root + 'harriet/#FMT#/h23.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Sounds like a fire hazard.",
				url: media_root + 'lift/#FMT#/l13.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "It's not a fire hazard, it's the only place I feel safe.",
				url: media_root + 'harriet/#FMT#/h24.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Then why did you leave?",
				url: media_root + 'lift/#FMT#/l14.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Because I wanted to see if I could. But I can't. It was a stupid idea.",
				url: media_root + 'harriet/#FMT#/h25.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "It doesn't sound like a stupid idea.",
				url: media_root + 'lift/#FMT#/l15.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "I'm stuck in a box, three storeys high.",
				url: media_root + 'harriet/#FMT#/h26.#FMT#'
			},
/*
			{
				track: 'lift',
				env: 'lift',
				text: "That's because you quit, not because you tried.",
				url: media_root + 'lift/#FMT#/l16.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Well if I hadn't tried, I wouldn't have quit.",
				url: media_root + 'harriet/#FMT#/h27.#FMT#'
			},
*/
			{
				track: 'lift',
				env: 'lift',
				text: "If you hadn't tried you'd be stuck at home.",
				url: media_root + 'lift/#FMT#/l17.#FMT#'
			},
/*
			{
				track: 'harriet',
				env: 'lift',
				text: "Exactly!",
				url: media_root + 'harriet/#FMT#/h28.#FMT#'
			},
*/
			{
				track: 'lift',
				env: 'lift',
				text: "Sitting in a box, five storeys high.",
				url: media_root + 'lift/#FMT#/l18.#FMT#',
				tRel: 0.5,
				noGap: true
			},
/*
			{
				track: 'harriet',
				env: 'lift',
				text: "Well at least I'd have some peace and quiet.",
				url: media_root + 'harriet/#FMT#/h29.#FMT#'
			},
*/
			{
				track: 'lift',
				env: 'lift',
				text: "All alone.",
				url: media_root + 'lift/#FMT#/l19.#FMT#',
				tRel: 1,
				noGap: true
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "I've got a phone.",
				url: media_root + 'harriet/#FMT#/h30.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Missing out on all of " + geoData.city + "." // <-- The city goes here
				// url: media_root + 'lift/#FMT#/l20.#FMT#' // This is generated speech. Ignoring: l20.#FMT#
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "I've got a window.",
				url: media_root + 'harriet/#FMT#/h31.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "On a beautiful morning like this.", // <-- geo weather opportunity
				url: media_root + 'lift/#FMT#/l21.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "It's not that great.",
				url: media_root + 'harriet/#FMT#/h32.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "And all because you can't get through ten minutes of panic.",
				url: media_root + 'lift/#FMT#/l22.#FMT#'
			},
/*
			{
				track: 'harriet',
				env: 'lift',
				text: "Ha! Ten minutes! I haven't locked myself up for years to avoid ten minutes.",
				url: media_root + 'harriet/#FMT#/h33.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "How do you know?",
				url: media_root + 'lift/#FMT#/l23.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "I know better than you! What have you ever been through?",
				url: media_root + 'harriet/#FMT#/h34.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "I've had my ups and downs.",
				url: media_root + 'lift/#FMT#/l24.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Oh yeah, your life's a rollercoaster.",
				url: media_root + 'harriet/#FMT#/h35.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Why would you rather sit and stare at the world than go out there and enjoy it?",
				url: media_root + 'lift/#FMT#/l25.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Rather?! This has nothing to do with what I want. It's not a choice.",
				url: media_root + 'harriet/#FMT#/h36.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "It is.",
				url: media_root + 'lift/#FMT#/l26.#FMT#'
			},
*/
			{
				track: 'harriet',
				env: 'lift',
				text: "You've no idea what this is like.",
				url: media_root + 'harriet/#FMT#/h37.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "I've had my ups and downs.",
				url: media_root + 'lift/#FMT#/l24.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "If you felt the fear I did when you tried to go to the ground floor...",
				url: media_root + 'harriet/#FMT#/h37a.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "I'd rise above it.",
				url: media_root + 'lift/#FMT#/l27.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "No, you'd be just like me.",
				url: media_root + 'harriet/#FMT#/h38.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Stuck.",
				url: media_root + 'lift/#FMT#/l28.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "It's not my fault.",
				url: media_root + 'harriet/#FMT#/h39.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "That doesn't mean you don't have a choice. You could do anything.",
				url: media_root + 'lift/#FMT#/l29.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Anything.",
				url: media_root + 'harriet/#FMT#/h40.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "You could go to the " + geoData.attraction[0] + "." // <-- Geo opportunity
				// url: media_root + 'lift/#FMT#/l30.#FMT#' // This is generated speech. Ignoring: l30.#FMT#
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Wow, inspiring. At least you didn't say I could reach for the stars.",
				url: media_root + 'harriet/#FMT#/h41.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "You can't. That's very improbable.",
				url: media_root + 'lift/#FMT#/l31.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "It's a phrase.",
				url: media_root + 'harriet/#FMT#/h42.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "You could make it to the " + geoData.attraction[1] + "." // <-- Geo opportunity
				// url: media_root + 'lift/#FMT#/l32.#FMT#' // This is generated speech. Ignoring: l32.#FMT#
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "In my case, that's still pretty unlikely.",
				url: media_root + 'harriet/#FMT#/h43.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "No, it's extremely rational.", // In speak.js: "No, it's extreemlee rational."
				url: media_root + 'lift/#FMT#/l33.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Emotionally, I mean. You're not getting this.",
				url: media_root + 'harriet/#FMT#/h44.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "I understand emotions.",
				url: media_root + 'lift/#FMT#/l34.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Yeah, you can tell, you sound really...",
				url: media_root + 'harriet/#FMT#/h45.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Elevated?",
				url: media_root + 'lift/#FMT#/l35.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "No. See this is my point, you don't understand. It doesn't matter where I go, it'll be same. If I go out there I'll feel ill.",
				url: media_root + 'harriet/#FMT#/h46.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "For a few minutes.",
				url: media_root + 'lift/#FMT#/l36.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "No...",
				url: media_root + 'harriet/#FMT#/h47.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "...and then you'll have a lovely time.",
				url: media_root + 'lift/#FMT#/l37.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Oh really?",
				url: media_root + 'harriet/#FMT#/h48.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Well, it's " + (geoData.weather.sunny[0] ? "sunny" : "raining") + ". I guess it depends how much you like the " + (geoData.weather.sunny[0] ? "sun" : "rain") + "." // <-- Geo weather opportunity?
				// url: media_root + 'lift/#FMT#/l38.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "And what about the horrific fear?",
				url: media_root + 'harriet/#FMT#/h49.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "At least you wouldn't be alone.",
				url: media_root + 'lift/#FMT#/l39.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Stop saying that! I'm not alone.",
				url: media_root + 'harriet/#FMT#/h50.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "You have friends up in your flat?",
				url: media_root + 'lift/#FMT#/l40.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "We speak online.",
				url: media_root + 'harriet/#FMT#/h51.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Oh.",
				url: media_root + 'lift/#FMT#/l41.#FMT#'
			},
/*
			{
				track: 'harriet',
				env: 'lift',
				text: "It's nice!",
				url: media_root + 'harriet/#FMT#/h52.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Wonderful.",
				url: media_root + 'lift/#FMT#/l42.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Oh what do you know?",
				url: media_root + 'harriet/#FMT#/h53.#FMT#'
			},
*/
			{
				track: 'lift',
				env: 'lift',
				text: "Hmm... Maybe if you got off " + socialData.text + " and went outside...", // <-- Social Networks opportunity
				tRel: 2,
				noGap: true
				// url: media_root + 'lift/#FMT#/l43.#FMT#' // Ignoring this #FMT#
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "What? I could make real-life friends and go ...snorkeling or something?",
				url: media_root + 'harriet/#FMT#/h54.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "That's unrealistic.",
				url: media_root + 'lift/#FMT#/l44.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Said the talking lift.",
				url: media_root + 'harriet/#FMT#/h55.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				subtitle: "You could go to the cinema. " + geoData.movies.comedy[0] + " is on, it'll be funny.",
				text: "You could go to the sin-uh-muh. " + geoData.movies.comedy[0] + " is on, it'll be funny." // <-- Geo opportunity?
				// url: media_root + 'lift/#FMT#/l45.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Locked in a dark room, with all those people ...? What if I just started screaming?",
				url: media_root + 'harriet/#FMT#/h56.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "See a horror. " + geoData.movies.horror[0] + " is on. It won't matter if you scream." // <-- Geo opportunity?
				// url: media_root + 'lift/#FMT#/l46.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "That's your suggestion, is it? Stick to frightening things so my anxiety seems appropriate?",
				url: media_root + 'harriet/#FMT#/h57.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "You could ride a motorcycle and work as a window cleaner on tall buildings.",
				url: media_root + 'lift/#FMT#/l47.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "No!",
				url: media_root + 'harriet/#FMT#/h58.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Everyone would think you were cool.",
				url: media_root + 'lift/#FMT#/l48.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Not if I was screaming. People don't want that in a window cleaner.",
				url: media_root + 'harriet/#FMT#/h59.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "So don't do anything frightening, just go outside.",
				url: media_root + 'lift/#FMT#/l49.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "But...",
				url: media_root + 'harriet/#FMT#/h60.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				subtitle: "It wouldn't be so scary just to go for a drink in " + geoData.drink[0] + " or a meal at " + geoData.eat[0] + ".",
				text: "It wouldn't be so skair-ee just to go for a drink in " + geoData.drink[0] + " or a meal at " + geoData.eat[0] + "." // <-- Geo opportunity
				// url: media_root + 'lift/#FMT#/l50.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "No, but...",
				url: media_root + 'harriet/#FMT#/h61.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Less scary than sitting in a fire hazard.",
				url: media_root + 'lift/#FMT#/l51.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "It's not a fire hazard!",
				url: media_root + 'harriet/#FMT#/h62.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Or throwing everything away to avoid ten minutes of panic.",
				url: media_root + 'lift/#FMT#/l52.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "It's not ten minutes!",
				url: media_root + 'harriet/#FMT#/h63.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "What if I'm right?",
				url: media_root + 'lift/#FMT#/l53.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "You're not! Look, this isn't my only chance you know. It's not now or never. I'll try again. Tomorrow.",
				url: media_root + 'harriet/#FMT#/h64.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Today.",
				url: media_root + 'lift/#FMT#/l54.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Oh come on, why does it matter? What's going to happen in a day?",
				url: media_root + 'harriet/#FMT#/h65.#FMT#'
			},
			// SOUND: NEWS PLAYS
			{ // Asset # 130
				id: 'tune-radio',
				track: 'radio',
				env: 'lift',
				text: "(the news)",
				// mp3: 'http://downloads.bbc.co.uk/podcasts/radio/newspod/newspod_20120507-1533a.mp3',
				mp3: geoData.news.url[0],
				tOffset: 30, // Optional: offset to start playing the podcast from.
				duration: 8, // Overrides the duration.
				forceDuration: true, // Optional: Causes the audio to stop at the duration time.
				tRel: 1, // padding for the radio tuning branch.
				// noGap: true,
				fader: [
					{
						tRel: 0
					},
					{
						tRel: 1
					},
					{
						rel: 'end',
						tRel: -2
					},
					{
						rel: 'end',
						tRel: 0
					}
				],
				faderStyle: 'radio',
				filterStyle: 'radio'
			},
			{
				id: 'tune-radio-out',
				track: 'harriet',
				env: 'lift',
				text: "Alright, alright...",
				url: media_root + 'harriet/#FMT#/h66.#FMT#',
				tRel: -2,
				noGap: true
			},
			// SOUND: NEWS FADES OUT
			{
				track: 'lift',
				env: 'lift',
				text: "You've lost a lot of days. Why add another?",
				url: media_root + 'lift/#FMT#/l55.#FMT#'
				// tRel: 1
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Because it doesn't work like that. You don't just go from one extreme to another. You're supposed to do it in bitesize pieces. It's called gradual exposure.",
				url: media_root + 'harriet/#FMT#/h67.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Bitesize pieces.",
				url: media_root + 'lift/#FMT#/l56.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Yeah.",
				url: media_root + 'harriet/#FMT#/h68.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Hm.",
				url: media_root + 'lift/#FMT#/l57.#FMT#'
			},
			{
                id:'lift-starts-down-again-2',
				track: 'sfx',
				env: 'lift',
				text: "(The lift drops to the 2nd floor with a clang)",
				url: media_root + 'sfx/#FMT#/sfx-22-lift-drop-clang.#FMT#',
				tRel: 2,
				noGap: true
			},
			{
				id:'lift-stops-at-2nd',
                track: 'lift',
				env: 'lift',
				text: "Second floor.",
				url: media_root + 'lift/#FMT#/l58.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "What are you doing?!",
				url: media_root + 'harriet/#FMT#/h69.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Gradual exposure.",
				url: media_root + 'lift/#FMT#/l59.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "That wasn't very gradual!",
				url: media_root + 'harriet/#FMT#/h70.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Trust me, I can go a lot further.",
				url: media_root + 'lift/#FMT#/l60.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "You can't just do that, it's dangerous!",
				url: media_root + 'harriet/#FMT#/h71.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Definitely more dangerous than going outside.",
				url: media_root + 'lift/#FMT#/l61.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "That's the plan, is it? Scare the wits out of me so I'll run out to the... the...",
				url: media_root + 'harriet/#FMT#/h72.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: geoData.attraction[2] + "?" // <-- Geo opportunity
				// url: media_root + 'lift/#FMT#/l62.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Oh, why there?!",
				url: media_root + 'harriet/#FMT#/h73.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "I've heard it's enchanting.",
				url: media_root + 'lift/#FMT#/l63.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "That's it! You are not an authority on the outside world!",
				url: media_root + 'harriet/#FMT#/h74.#FMT#'
			},
/*
			{
				track: 'lift',
				env: 'lift',
				text: "Not even the seventh floor?",
				url: media_root + 'lift/#FMT#/l64.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Yeah, yeah...",
				url: media_root + 'harriet/#FMT#/h75.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "It could be an oasis.",
				url: media_root + 'lift/#FMT#/l65.#FMT#'
			},
*/
			{
				track: 'harriet',
				env: 'lift',
				text: "Where are those engineers? I've been trapped in here forever.",
				url: media_root + 'harriet/#FMT#/h76.#FMT#',
				tRel: 2,
				noGap: true
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Nine minutes and twenty seconds.", // Want the lift to say a time closer to this point. One issue is it should change with the timing... As in regenerate the asset when timing changes, which is non-trivial.
				url: media_root + 'lift/#FMT#/l66.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Really... I don't think I've been out of my flat this long, for... what's the date today?",
				url: media_root + 'harriet/#FMT#/h77.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text:  dateData.date // <-- Insert the DATE!
				// url: media_root + 'lift/#FMT#/l67.#FMT#' // This is generated speech. Ignoring: l67.#FMT#
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Nearly two years. I haven't seen the ground floor since I moved in.",
				url: media_root + 'harriet/#FMT#/h78.#FMT#',
				tRel: 1,
				noGap: true
			},
			{
				track: 'lift',
				env: 'lift',
				text: "How's your heart?",
				url: media_root + 'lift/#FMT#/l68.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "Intact.",
				url: media_root + 'harriet/#FMT#/h79.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Maybe I was right.",
				url: media_root + 'lift/#FMT#/l69.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "What?",
				url: media_root + 'harriet/#FMT#/h80.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Ten minutes.",
				url: media_root + 'lift/#FMT#/l70.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "You weren't right.",
				url: media_root + 'harriet/#FMT#/h81.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "I was right.",
				url: media_root + 'lift/#FMT#/l71.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "No, you said ten minutes of panic.",
				url: media_root + 'harriet/#FMT#/h82.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Yeah.",
				url: media_root + 'lift/#FMT#/l72.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lift',
				text: "I'm not panicking.",
				url: media_root + 'harriet/#FMT#/h83.#FMT#'
			},
			{
				id:'harriet-pushes-button-to-go-down-1',
                track: 'sfx',
				env: 'lift',
				text: "(Harriet presses a button)",
				url: media_root + 'sfx/#FMT#/sfx-23-lift-button.#FMT#'
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(The lift moves down)",
				url: media_root + 'sfx/#FMT#/sfx-24-lift-down-one-floor.#FMT#',
				tRel: 0.5,
				noGap: true
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Lift going down. First floor.",
				url: media_root + 'lift/#FMT#/l73.#FMT#',
				rel: 'start'
			},
			{
                id:'lift-arrives-at-1st',
				track: 'harriet',
				env: 'lift',
				text: "(Harriet takes a few deep breaths)",
				url: media_root + 'harriet/#FMT#/h84.#FMT#'
			},
			{
				id:'harriet-pushes-button-to-go-down-2',
                track: 'sfx',
				env: 'lift',
				text: "(Harriet presses a button)",
				url: media_root + 'sfx/#FMT#/sfx-25-lift-button.#FMT#'
			},
			{
				track: 'sfx',
				env: 'lift',
				text: "(The lift moves down)",
				url: media_root + 'sfx/#FMT#/sfx-26-lift-down-one-floor.#FMT#'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Lift going down.",
				url: media_root + 'lift/#FMT#/l74a.#FMT#',
				rel: 'start'
			},
			{
                track: 'sfx',
				env: 'lift',
				text: "(The lift bell rings)",
				url: media_root + 'sfx/#FMT#/sfx-27-lift-bell.#FMT#'
			},
			{
                id: 'lift-arrives-at-ground',
				track: 'lift',
				env: 'lift',
				text: "Ground floor.",
				url: media_root + 'lift/#FMT#/l74b.#FMT#',
				rel: 'start'
			},
			{
				track: 'lift',
				env: 'lift',
				text: "Doors opening.",
				url: media_root + 'lift/#FMT#/l74c.#FMT#',
				tRel: 0.5,
				noGap: true
			},
			{
                id:'lift-doors-open-on-ground',
				track: 'sfx',
				env: 'lift',
				text: "(The lift doors open)",
				url: media_root + 'sfx/#FMT#/sfx-28-lift-door-open.#FMT#'
			},

			// (HARRIET STAYS WHERE SHE IS STEADYING HER BREATH, THEN TAKES A FEW WARY STEPS)

			{
				id: 'lift-ambient-end',
				track: 'sfx',
				env: 'lobby',
				text: "(Harriet's heels click slowly, uncertainly on the foyer floor)",
				url: media_root + 'sfx/#FMT#/sfx-29-wary-steps.#FMT#'
			},
			{
				track: 'concierge',
				env: 'lobby',
				text: "You ok there, love?",
				url: media_root + 'concierge/#FMT#/c3.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lobby',
				text: "Yeah... Oh, call off the engineers, the lift's fine.",
				url: media_root + 'harriet/#FMT#/h85.#FMT#'
			},

			{
				track: 'concierge',
				env: 'lobby',
				text: "The lift?",
				url: media_root + 'concierge/#FMT#/c4.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lobby',
				text: "Yeah, we spoke before. I pressed the emergency button.",
				url: media_root + 'harriet/#FMT#/h86.#FMT#'
			},
			{
				track: 'concierge',
				env: 'lobby',
				text: "I don't think so, love. That hasn't gone off all day.",
				url: media_root + 'concierge/#FMT#/c5.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lobby',
				text: "Oh. Right.",
				url: media_root + 'harriet/#FMT#/h87.#FMT#'
			},
			{
				track: 'concierge',
				env: 'lobby',
				text: "Going out?",
				url: media_root + 'concierge/#FMT#/c6.#FMT#'
			},
			{
				track: 'harriet',
				env: 'lobby',
				text: "I guess so...",
				url: media_root + 'harriet/#FMT#/h88.#FMT#'
			},
			{
				id: 'music-singing',
				track: 'sfx',
				env: 'lobby',
				text: "(Harriet opens the outer door)",
				url: media_root + 'sfx/#FMT#/sfx-30-outer-door.#FMT#'
			},
			{
				id: 'end-credits',
				track: 'announcement',
				env: 'none',
				text: "(End credits)",
				url: media_root + 'announcement/#FMT#/end-credits.#FMT#',
				tRel: 10
			}
		];



/*
			// Format of the Timeline Branch entity object.
			{
				id: 'id', // Optional unique ID for this asset. Branches use IDs to relate their timings to a timeline.
				// the id is used here more for the assetplay event id hook.

				track: 'track name', // For gain/effect style map
				env: 'Environment name', // For gain/effect style map
				text: "TEXT", // The script or description of sound.
				subtitle: "TEXT", // Optional: English version of text without phonetics. Only used where speech generated.

				url: media_root + 'harriet/#FMT#/h1.#FMT#', // Optional: If undefined, the text speech is generated.
				loop: true, // Optional: Causes the sound to loop. If used, tEndId required. Also causes WAV to be used.

				timeId: 'id', // ID of start relative ID.
				rel: 'end', // Optional: Relative to the (timeId) start time (default) or to the end time of the relative ID.
				tRel: 42, // Optional: Default 0. Fine control of item's relative timings (timeId)

				tEndId: 'id', // ID of end relative ID. Required for looped entities.
				relEnd: 'end', // Optional: Relative to the (tEndId) start time (default) or to the end time of the relative ID.
				tRelEnd: 42, // Optional: Default 0. Fine control of item's relative timings (tEndId)

				// A usual fader will have at least 4 timing points: Initial, Audiable1, Audiable2, Final. Eg., Equating to 6, 7, 20, 21. So the ramp can be controlled.
				// Fader Ratios are implemented through Track/Env styles. The style defines the gain ratios at the time points.
				// Generaly, you'll want to make a unique track for the branch entity, unless it makes sense for items to share one.
				fader: [
					{
						id: 'id', // ID of fader point relative timing ID.
						rel: 'end' // Optional: Relative to the (id) start time (default) or to the end time of the relative ID.
						tRel: 3 // Optional: Default 0. Fine control of item's relative timings (id)
					}
				]

				filterStyle: 'muffled' // Optional: The filter style to use.
*/

		var branches = [
			{
				id: 'the-start',
				track: 'music',
				env: 'flat',
				text: "(Music plays)",
				url: media_root + 'music/#FMT#/music-loop-x2.#FMT#',
				loop: true,
				timeId: 'master-start',
				// rel: 'start',
				// tRel: -10, // (6s quiet.) 11s silent minus 1s in door close.
				// tRel: -6, // To match 1st item offset in master timeline.
				tRel: -tInitialMusicIntro, // See the first master timeline entity, which has plus this timing. Hence the var.
				tEndId: 'flat-door',
				// relEnd: 'start', // default start.
				tRelEnd: 1,
				fader: [
					{
						id: 'master-start',
						// rel: 'end', // default start. option of end.
						// tRel: -6 // timing offset.
						tRel: -tInitialMusicIntro // timing offset.
						// fader styles: Define the ratio of the gains at each point. ie., predefined structure for this type of style. Eg., Define 3 fader styles and use 2 time points here. 1st style is initial condition.
					},
/*
					{
						id: 'master-start',
						tRel: -tInitialMusicIntro + 1
					},
*/
					{
						// id:'flat-hall',
						id: 'master-start',
						tRel: 0
					},
					{
						// id:'flat-hall'
						id: 'master-start',
						tRel: 1
					},
					{
						id: 'flat-door'
					},
					{
						id: 'flat-door',
						tRel: 1
					}
				],
				faderStyle: 'flat-music',
				filterStyle: 'muffled'
			},
			{
				track: 'sfx',
				env: 'lift',
				depth: 'background',
				text: "(The lift goes down)",
				url: media_root + 'sfx/#FMT#/sfx-10-lift-moving-down.#FMT#',
				timeId: 'lift-starts',
				rel: 'end',
				// tRel: 1,
				tEndId: 'lift-halts',
				tRelEnd: 1,
				fader: [
					{
						id: 'lift-starts',
						rel: 'end'
						// tRel: 1
					},
					{
						id: 'lift-halts'
					},
					{
						id: 'lift-halts',
						tRel: 1
					}
				],
				faderStyle: 'lift-first-move'
			},
			{
				track: 'ambient',
				env: 'lift',
				text: "(Ambient sound of lift)",
				url: media_root + 'sfx/#FMT#/sfx-lift-ambient-x2.#FMT#',
				loop: true,
				timeId: 'lift-ambient-start',
				tEndId: 'lift-ambient-end',
				// rel: 'start',
				// tRel: 0,
				fader: [
					{
						id: 'lift-ambient-start'
						// rel: 'end', // default start. option of end.
						// tRel: 0 // timing offset.
						// fader styles: Define the ratio of the gains at each point. ie., predefined structure for this type of style. Eg., Define 3 fader styles and use 2 time points here. 1st style is initial condition.
					},
					{
						id: 'lift-ambient-start',
						tRel: 2
					},
					{
						id: 'lift-ambient-end',
						tRel: -2
					},
					{
						id: 'lift-ambient-end'
					}
				],
				faderStyle: 'lift-ambient'
			},
			{
				track: 'tune-radio',
				env: 'lift',
				text: "(Tuning radio in)",
				url: media_root + 'sfx/#FMT#/radiostatic.#FMT#',
				timeId: 'tune-radio',
				tEndId: 'tune-radio',
				tRel: -1,
				tRelEnd: 1,
				fader: [
					{
						id: 'tune-radio',
						tRel: -1
					},
/*
					{
						id: 'tune-radio',
						tRel: -1
					},
*/
					{
						id: 'tune-radio',
						tRel: 0
					},
					{
						id: 'tune-radio',
						tRel: 1
					}
				],
				faderStyle: 'tune-radio',
				filterStyle: 'radio'
			},
/*
			{
				track: 'tune-radio',
				env: 'lift',
				text: "(Tuning radio out)",
				url: media_root + 'sfx/#FMT#/radiostatic.#FMT#',
				timeId: 'tune-radio',
				tEndId: 'tune-radio',
				rel: 'end',
				relEnd: 'end',
				tRel: -4,
				tRelEnd: 0,
				fader: [
					{
						id: 'tune-radio',
						rel: 'end',
						tRel: -4
					},
					{
						id: 'tune-radio',
						rel: 'end',
						tRel: -3
					},
					{
						id: 'tune-radio',
						rel: 'end',
						tRel: -1
					},
					{
						id: 'tune-radio',
						rel: 'end',
						tRel: 0
					}
				],
				faderStyle: 'tune-radio',
				filterStyle: 'radio'
			},
*/
			{
				track: 'music',
				env: 'lobby',
				text: "(Music plays)",
				url: media_root + 'music/#FMT#/music-sing-33.#FMT#',
				timeId: 'music-singing',
				// rel: 'start',
				tRel: -31, // minus 33s to singing in music plus 2s in door open sound
				fader: [
					{
						id: 'lift-ambient-end',
						tRel: 1
					},
					{
						id: 'lift-ambient-end',
						tRel: 2
					},
					{
						id: 'music-singing',
						tRel: 1
					},
					{
						id: 'music-singing',
						tRel: 2
					},
					{
						id: 'end-credits',
						tRel: -0.5
					},
					{
						id: 'end-credits',
						tRel: 0.5
					},
					{
						id: 'end-credits',
						rel: 'end',
						tRel: 1
					},
					{
						id: 'end-credits',
						rel: 'end',
						tRel: 2
					}
				],
				faderStyle: 'lobby-music',
				filterStyle: 'muffled'
			}
		];

		var weather = [
			{
				track: 'weather',
				env: 'lobby',
				// text: "(weather sound)",
				// url: media_root + 'sfx/#FMT#/sunny.#FMT#',
				timeId: 'music-singing',
				// rel: 'start',
				tRel: 1
			}
		];

		if(geoData.weather.sunny[0]) {
			weather[0].text = "(sunny sounds)";
			weather[0].url = media_root + 'sfx/#FMT#/sunny.#FMT#';
		} else {
			weather[0].text = "(rain sounds)";
			weather[0].url = media_root + 'sfx/#FMT#/rain.#FMT#';
		}

		// Create the Perceptive Media instance.
		var myPM = new PerceptiveMedia();

		// Set the default time gap
		myPM.setTimeGap('master', -0.5);

		// Setup the Track and Environment styles.

		myPM.setTrackEnv('harriet', 'flat', {
			// effect:1,
			bufferGain: 2,
			effectGain: 0,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});
		myPM.setTrackEnv('harriet', 'lift', {
			effect:1,
			bufferGain: 2,
			effectGain: 4,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});
		myPM.setTrackEnv('harriet', 'lobby', {
			effect:0, // want this to be like 'lobby' and it map to the effect prop name. Env and effect would then match and seem redundant. Maybe not though... They are different. Will think on it during dev...
			bufferGain: 2,
			effectGain: 4,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});

		// No: lift / flat
		myPM.setTrackEnv('lift', 'flat', {
			// effect:1,
			bufferGain: 0.3,
			effectGain: 0,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});
		myPM.setTrackEnv('lift', 'lift', {
			effect:1,
			bufferGain: 0.3,
			effectGain: 0.6,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});
		myPM.setTrackEnv('lift', 'lobby', {
			effect:0,
			bufferGain: 0.3,
			effectGain: 0.6,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});

		myPM.setTrackEnv('sfx', 'flat', {
			// effect:0,
			bufferGain: 2,
			effectGain: 0,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});
		myPM.setTrackEnv('sfx', 'lift', {
			effect:1,
			bufferGain: 2,
			effectGain: 4,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});
		myPM.setTrackEnv('sfx', 'lobby', {
			effect:0,
			bufferGain: 2,
			effectGain: 4,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});

		// No: concierge / flat
		myPM.setTrackEnv('concierge', 'lift', {
			effect:1,
			bufferGain: 2,
			effectGain: 4,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});
		myPM.setTrackEnv('concierge', 'lobby', {
			effect:0,
			bufferGain: 2,
			effectGain: 4,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});

		myPM.setTrackEnv('music', 'flat', {
			// effect:0,
			bufferGain: 0.4,
			effectGain: 0,
			bufferFilterGain: 0.4,
			effectFilterGain: 0,
			depth: 'background'
		});
		// No: music / lift
		myPM.setTrackEnv('music', 'lobby', {
			effect:0,
			bufferGain: 0.4,
			effectGain: 0.8,
			bufferFilterGain: 0.2,
			effectFilterGain: 0.4,
			depth: 'background'
		});

		// No: ambient / flat
		myPM.setTrackEnv('ambient', 'lift', {
			effect:0,
			bufferGain: 2,
			effectGain: 4,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'background'
		});
		// No: ambient / lobby

		myPM.setTrackEnv('radio', 'lift', {
			effect:1,
			bufferGain: 0,
			effectGain: 0,
			bufferFilterGain: 0.6,
			effectFilterGain: 1.2,
			depth: 'foreground'
		});

		myPM.setTrackEnv('tune-radio', 'lift', {
			effect:1,
			bufferGain: 0,
			effectGain: 0,
			bufferFilterGain: 0.6,
			effectFilterGain: 1.2,
			depth: 'foreground'
		});

		myPM.setTrackEnv('weather', 'lobby', {
			// effect:0,
			bufferGain: 2,
			effectGain: 0,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'background'
		});

		myPM.setTrackEnv('announcement', 'none', {
			// effect:0,
			bufferGain: 2,
			effectGain: 0,
			bufferFilterGain: 0,
			effectFilterGain: 0,
			depth: 'foreground'
		});

		// Fader Styles

		myPM.setFader('lift-first-move', [
			{
				bufferRatio: 1,
				effectRatio: 1,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
			{
				bufferRatio: 1,
				effectRatio: 1,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			}
		]);

		myPM.setFader('flat-music', [
/*
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
*/
			{
				bufferRatio: 1,
				effectRatio: 1,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
			{
				bufferRatio: 1,
				effectRatio: 1,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 1,
				effectFilterRatio: 1
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 1,
				effectFilterRatio: 1
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			}
		]);

		myPM.setFader('lobby-music', [
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 1,
				effectFilterRatio: 1
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 1,
				effectFilterRatio: 1
			},
			{
				bufferRatio: 1,
                effectRatio: 0,
                bufferFilterRatio: 0,
                effectFilterRatio: 0
            },
            {
                bufferRatio: 1,
                effectRatio: 0,
                bufferFilterRatio: 0,
                effectFilterRatio: 0
            },
            {
                bufferRatio: 0.2,
                effectRatio: 0,
                bufferFilterRatio: 0,
                effectFilterRatio: 0
            },
            {
                bufferRatio: 0.2,
                effectRatio: 0,
                bufferFilterRatio: 0,
                effectFilterRatio: 0
            },
            {
                bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			}
		]);

		myPM.setFader('lift-ambient', [
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
			{
				bufferRatio: 1,
				effectRatio: 1,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
			{
				bufferRatio: 1,
				effectRatio: 1,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			}
		]);

		myPM.setFader('radio', [
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 1,
				effectFilterRatio: 1
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 1,
				effectFilterRatio: 1
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			}
		]);

		myPM.setFader('tune-radio', [
/*
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			},
*/
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 1,
				effectFilterRatio: 1
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 1,
				effectFilterRatio: 1
			},
			{
				bufferRatio: 0,
				effectRatio: 0,
				bufferFilterRatio: 0,
				effectFilterRatio: 0
			}
		]);


		// Filter Styles

		myPM.setFilter('muffled', {
			type: 0, // Lowpass
			frequency: 200,
			Q: 2,
			gain: 0
		});

		myPM.setFilter('radio', {
			type: 1, // Highpass
			frequency: 2000,
			Q: 2,
			gain: 0
		});

		// Set the total number of assets to be loaded
		myPM.setTotalAssets(effect.length + master.length + branches.length + weather.length);

		// And now prepare the chunks in the order they are used. Required to enable relative timing system.

		myPM.prepareEffects(effect, function(effectGroup) {
			myPM.appendTimeline('master', master, [{time:0,tEnd:0}], function(group) {
				myPM.attachBranches('master', branches, function(group) {
					myPM.attachBranches('master', weather, function(group) {
						myPM.enable();
					});
				});
			});
		});

		return myPM;
	};
})(jQuery);

// jQuery(document).ready(function($) {
	// initBreakingOut({city:"Edinburgh"});
// });
