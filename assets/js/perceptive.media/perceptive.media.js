/*
 * The Perceptive Media JavaScript Library.
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
/*jshint asi:false, bitwise:false, boss:false, browser:true, curly:false, debug:false, devel:false, eqeqeq:true, eqnull:false, evil:false, forin:false, immed:false, jquery:true, laxbreak:false, newcap:false, noarg:true, noempty:false, nonew:true, onevar:false, passfail:false, plusplus:false, regexp:false, undef:true, sub:false, strict:false, white:false smarttabs:true */

var PerceptiveMedia; // Global

(function($, undefined) {

	var DEBUG = true;
	// PAD_FIREFOX_TIMINGS = 0.2; // The WAVs and MP3s have different durations in firefox/chrome. This padding is added to the wavs in Firefox in an attempt to align the timings comparably. ie., Firefox played too fast.

	// Public
	PerceptiveMedia = function() {
		var self = this;

		this.ready = false;
		this.playing = false;

		this.duration = 0;
		this.endedID = null; // Timeout ID for the ended event.

		this.startTime = 0;
		this.currentTime = 0;

		this.currentAsset = null; // Stores the asset at the current time during updateTimings() during playback.
		this.currentAssetTime = 0; // Stores the time with reference to the asset at the current time during updateTimings() during playback.

		this.fallbackNormalizer = 0.5;

		this.assets = {
			// master: [], // Created by addSound() and generateSpeech()
			branch: [],
			effect: [] // Created by addEffect()
		};

		// The Track and Environment gain and effect styles are stored here.
		this.trackEnv = {};
		this.faderStyle = {};
		this.filterStyle = {};

		// The time gaps for each asset set. ie., this.assets
		this.tGap = {
			master: 1
		};

		// Stored pointers to the config input group arrays. (Not copies of the array.)
		this.group = {
			// sound: [], // Created by prepareStaticSoundGroup()
			// speech: [], // Created by prepareDynamicSpeechGroup()
			effect: [] // Created by prepareEffects()
		};

		// This is to hold the callback, since it cannot be passed through the worker
		this.callback = {
			generateSpeech: []
		};

		this.status = {
			assetsLoaded: 0,
			assetsTotal: 0
		};

		// Will hold an analyser node per track. ie., So all the lift speech goes into 1 analyser and Harriet's goes into another.
		// Analysers use the original sound.
		// NB: Not sure whether it should be the original, or after the normal gain node so the levels are similar to the ear.
		// NB: Original sounds were quiet, so the FFT will give small values too... Hence why wonder whether to put after 1st gain node so if compared with each other, they would be normalized.
		// NB: But... Does that matter? In this case only lift required. Also, faders affect the 1st gain node... And why not be able to see the effect even if you cannot hear the lift speaking in distance.
		// Using the original sound source as the analyser input. Figure out the relative track variations via track/env gains if ever required.
		this.analyser = {};
		this.analyserData = {};
		this.analyserDestination = {};

		try {
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			this.context = new AudioContext();
		} catch(error) {
			// No Web Audio API
			this.context = false;
		}

		this.depthControl = 0.5;
		if(this.context) {
			// Effects will need similar, but on their inputs.

			this.depthGain = {
				foreground: 1,
				background: 1
			};

			this.destination = {
				foreground: this.context.createGainNode(),
				background: this.context.createGainNode()
			};
			this.destination.foreground.connect(this.context.destination);
			this.destination.background.connect(this.context.destination);

			this.updateDepthControl(); // So they default to the values defined by depthControl. NB: There are no effects at this point. They are set during their creation.
		}

		try {
			this.speakWorker = new Worker('assets/js/speak/speakWorker.js');
		} catch(e) {
			// if(DEBUG) console.log('perceptive.media.js : PerceptiveMedia() : speak.js warning : no worker support');
		}
	};
	PerceptiveMedia.prototype = {
		event: { // Static Object
			ready: 'pm_ready',
			play: 'pm_play',
			stop: 'pm_stop',
			ended: 'pm_ended',
			progress: 'pm_progress',
			playasset: 'pm_playasset',
			timingupdate: 'pm_timingupdate'
		},
		play: function() {},
		stop: function() {},
		enable: function() {
			var self = this;
			this.duration = this.getDuration();
			this.play = function(time) {
				self.playAssets(time);
			};
			this.stop = function(time) {
				self.stopAssets(time);
			};
			this.ready = true;
			// if(DEBUG) console.log('this.assets:');
			// if(DEBUG) console.dir(this.assets);
			// if(DEBUG) console.log('this:');
			// if(DEBUG) console.dir(this);
			this.trigger(this.event.ready);
		},
		disable: function() {},
		updateDepthControl: function() {
			if(this.context) {

				if(this.depthControl < 0) {
					this.depthControl = 0;
				} else if(this.depthControl > 1) {
					this.depthControl = 1;
				}

				this.depthGain.foreground = 2 - (2 * this.depthControl);
				this.depthGain.background = 2 * this.depthControl;

				this.destination.foreground.gain.value = this.depthGain.foreground;
				this.destination.background.gain.value = this.depthGain.background;

				for(var i = 0, len = this.assets.effect.length; i < len; i++) {
					this.assets.effect[i].updateDepthGains(this.depthGain);
				}
			}
		},
		playAssets: function(time) {
			var self = this;

			// Added this so you can use play(t1) and then play(t2) without always having to stop in between.
			if(time !== undefined) {
				this.stop();
			}

			if(this.ready && !this.playing) {
				time = time ? time * 1 : 0;
				this.playing = true;
				var tEnded = this.duration - time;

				if(this.context) {
					this.startTime = this.context.currentTime - time;
				} else {
					this.startTime = Date.now();
				}

				// The effect Assets receive this command, but ignore it.
				for(var assetType in this.assets) {
					if(this.assets.hasOwnProperty(assetType)) {
						for(var i = 0, len = this.assets[assetType].length; i < len; i++) {
							this.assets[assetType][i].play(time);
						}
					}
				}

				this.endedID = setTimeout(function() {
					self.stop();
					self.trigger(self.event.ended);
				}, (tEnded > 0 ? tEnded : 0) * 1000);

				this.trigger(this.event.play);
				return true;
			}
			return false;
		},
		stopAssets: function() {
			if(this.ready && this.playing) {
				this.playing = false;

				// The effect Assets receive this command, but ignore it.
				for(var assetType in this.assets) {
					if(this.assets.hasOwnProperty(assetType)) {
						for(var i = 0, len = this.assets[assetType].length; i < len; i++) {
							this.assets[assetType][i].stop();
						}
					}
				}

				clearTimeout(this.endedID);

				this.trigger(this.event.stop);
				return true;
			}
			return false;
		},
		getDuration: function() {
			var duration = 0;
			// The effect Assets receive this command, but ignore it.
			for(var assetType in this.assets) {
				if(this.assets.hasOwnProperty(assetType)) {
					for(var i = 0, len = this.assets[assetType].length; i < len; i++) {
						duration = duration < this.assets[assetType][i].tEnd ? this.assets[assetType][i].tEnd : duration;
					}
				}
			}
			return duration;
		},
		updateTimings: function(groupOrder) {
			if(this.ready) {

				var wasPlaying = this.playing,
				groupName, asset, g, gLen, i, iLen;

				if(this.playing) {
					/* Figure out where we are in the playback.
					 * 1) keep record here of startTime, like in Assets.
					 * 2) Calculate playback time. context.correntTime - startTime
					 * 3) Search the assets to see which one is active.
					 * NB: This method is called with a timeline Group Name. So it gets called twice atm!
					 * 4) Think we will look for the last asset that has a start time before the current playback time.
					 * 5) Calculate a timing offset relative to that asset. So we know how far in it was.
					 * 6) We then have the info we need...
					 * 7) Update all the timings.
					 * 8) Oh... If it was playing in the first place BTW too. if() was already around this comment though. Duh!
					 * 9) Then look at our reference Asset's start time, and add on the timing offset.
					 * 10) Play from that point. In Chrome it should be exact and pretty seemless.
					 * 11) Firefox seems borked atm. But have not expended any effort on that solution for a while.
					 */

					 // Firefox has a bug. Believe the startTime/cuurentTime reference has incorrect approach.

					if(this.context) {
						this.currentTime = this.context.currentTime - this.startTime;
					} else {
						this.currentTime = (Date.now() - this.startTime) / 1000;
					}
					this.currentAsset = null;
					this.currentAssetTime = 0;

					for(g = 0, gLen = groupOrder ? groupOrder.length : 0; g < gLen; g++) {
						groupName = groupOrder[g];
						for(i = 0, iLen = this.assets[groupName].length; i < iLen; i++) {
							asset = this.assets[groupName][i];
							if(asset.time < this.currentTime) {
								this.currentAsset = asset;
							} else {
								// Exit the nested loops.
								i = iLen;
								g = gLen;
							}
						}
					}

					if(!this.currentAsset) {
						this.currentAsset = this.assets[groupOrder[0]][0]; // The first element in the first group specified.
					}
					this.currentAssetTime = this.currentTime - this.currentAsset.time;
					this.stop();
				}

				for(g = 0, gLen = groupOrder ? groupOrder.length : 0; g < gLen; g++) {
					groupName = groupOrder[g];
					for(i = 0, iLen = this.assets[groupName].length; i < iLen; i++) {
						asset = this.assets[groupName][i];
						if(asset.rel === 'start') {
							asset.time = asset.relAssetStart ? asset.relAssetStart.time + asset.tRel : asset.tRel;
						} else if(asset.noGap) { // Branches always have this property set true.
							asset.time = asset.relAssetStart ? asset.relAssetStart.tEnd + asset.tRel : asset.tRel;
						} else {
							asset.time = asset.relAssetStart ? asset.relAssetStart.tEnd + this.tGap[groupName] + asset.tRel : this.tGap[groupName] + asset.tRel;
						}

						// End time is special for branches
						if(asset.relAssetEnd) {
							if(asset.relEnd === 'start') {
								asset.tEnd = asset.relAssetEnd ? asset.relAssetEnd.time + asset.tRelEnd : asset.tRelEnd;
							} else { // Don't care about noGap as never use it with branches.
								asset.tEnd = asset.relAssetEnd ? asset.relAssetEnd.tEnd + asset.tRelEnd : asset.tRelEnd;
							}
						} else {
							asset.tEnd = asset.time + asset.duration;
						}

						for(var f = 0, fLen = asset.fader.length; f < fLen; f++) {
							var fade = asset.fader[f];
							if(fade.rel === 'start') {
								fade.time = fade.relAssetStart ? fade.relAssetStart.time + fade.tRel : fade.tRel;
							} else { // Don't care about noGap as never use it with branches.
								fade.time = fade.relAssetStart ? fade.relAssetStart.tEnd + fade.tRel : fade.tRel;
							}
						}
					}
				}

				this.duration = this.getDuration();

				if(wasPlaying) {
					// Restart it again at the right point.
					this.play(this.currentAsset.time + this.currentAssetTime);
				}

				this.trigger(this.event.timingupdate);
			}
			return false;
		},
		setTimeGap: function(groupName, time) {
			// if(this.ready) {
				this.tGap[groupName] = time * 1;
			// }
			return false;
		},
		setTrackEnv: function(track, env, options) {
			if(this.ready) {
				// Change existing Track Env config.
				if(this.trackEnv[track] && this.trackEnv[track][env]) {
					this.trackEnv[track][env] = options;
				}
			} else {
				// Create Track Env. ie., During initial config.
				this.trackEnv[track] = this.trackEnv[track] ? this.trackEnv[track] : {};
				this.trackEnv[track][env] = options;

				// create the analyser if not already created.
				if(this.context && !this.analyser[track]) {
					this.analyser[track] = this.context.createAnalyser();
					this.analyser[track].fftSize = 256; // Min valid power of 2 is 128.
					this.analyser[track].smoothingTimeConstant = 0;
					this.analyserData[track] = new Uint8Array(this.analyser[track].frequencyBinCount);

					// The analyser node needs to be connected to the context.destination through the map or it does not bother processing the info.
					// Can only assume that the Web Audio API figures that there is no sound to process as it never connects to the destination.
					// I see that the Web Audio API docs does have a note saying that the RealtimeAnalyserNode may be left unconnected, but this cannot have been implemented yet.
					// Using a gain node with zero gain to connect it to desination while not being audiable.
					this.analyserDestination[track] = this.context.createGainNode();
					this.analyserDestination[track].gain.value = 0;
					this.analyserDestination[track].connect(this.context.destination);
					this.analyser[track].connect(this.analyserDestination[track]); // You need a destination or the analyser does nothing!
				} // Sorry, no fallback written for Web Data API even though it can be done.
			}
			this.fallbackNormalizer = this.getNormalizer();
		},
		getTrackFFT: function(track) {
			if(this.context) {
				this.analyser[track].getByteFrequencyData(this.analyserData[track]);
				return this.analyserData[track];
			} else {
				return new Uint8Array(128);
			}
		},
		getTrackPower: function(track) {
			if(this.context) {
				var power = 0;
				this.analyser[track].getByteFrequencyData(this.analyserData[track]);
				for(var i = 0, iLen = this.analyserData[track].length; i < iLen; i++) {
					power += this.analyserData[track][i];
				}
				power = power / this.analyserData[track].length / 255; // Average and then a ratio.
				return power;
			} else {
				return 0;
			}
		},
		setFader: function(fader, options) {
			this.faderStyle[fader] = options;
		},
		setFilter: function(filter, options) {
			this.filterStyle[filter] = options;
		},
		updateAssets: function(groupOrder) {
			if(this.ready) {

				// Work out the volume normalizer for the fallback.
				this.fallbackNormalizer = this.getNormalizer();

				for(var g = 0, gLen = groupOrder ? groupOrder.length : 0; g < gLen; g++) {
					var groupName = groupOrder[g];
					for(var i=0, iLen = this.assets[groupName].length; i < iLen; i++) {
						// if(DEBUG) console.log('updateAssets: ' + groupName + ': ' + i);
						var asset = this.assets[groupName][i];
						// group[i].effect = self.trackEnv[group[i].track][group[i].env].effect;
						asset.bufferGain = this.trackEnv[asset.track][asset.env].bufferGain;
						asset.effectGain = this.trackEnv[asset.track][asset.env].effectGain;
						asset.bufferFilterGain = this.trackEnv[asset.track][asset.env].bufferFilterGain;
						asset.effectFilterGain = this.trackEnv[asset.track][asset.env].effectFilterGain;

						asset.fallbackNormalizer = this.fallbackNormalizer;

						for(var f = 0, fLen = asset.fader.length; f < fLen; f++) {
							asset.fader[f].bufferGain = asset.bufferGain * this.faderStyle[asset.faderStyle][f].bufferRatio;
							asset.fader[f].effectGain = asset.effectGain * this.faderStyle[asset.faderStyle][f].effectRatio;
							asset.fader[f].bufferFilterGain = asset.bufferFilterGain * this.faderStyle[asset.faderStyle][f].bufferFilterRatio;
							asset.fader[f].effectFilterGain = asset.effectFilterGain * this.faderStyle[asset.faderStyle][f].effectFilterRatio;
						}

						if(asset.filterStyle) {
							asset.filter = this.filterStyle[asset.filterStyle];
						}

						// Want to call an asset method here that updates the gainNodes being used real-time.
						asset.applyGains();
					}
				}
			}
			return false;
		},
		getNormalizer: function() {
			var maxGain = 0;
			for(var trackType in this.trackEnv) {
				if(this.trackEnv.hasOwnProperty(trackType)) {
					for(var envType in this.trackEnv[trackType]) {
						if(this.trackEnv[trackType].hasOwnProperty(envType)) {

							var maxBufferGain = Math.max(this.trackEnv[trackType][envType].bufferGain, this.trackEnv[trackType][envType].bufferFilterGain);
							maxGain = maxBufferGain > maxGain ? maxBufferGain : maxGain;

						}
					}
				}
			}

			return maxGain > 0 ? 1/maxGain : 0;
		},
		prepareEffects: function(effect, callback) {
			var self = this,
				i = 0;
			this.group.effect.push(effect);
			var prepareEffectAsset = function(asset) {
				if(asset) {
					effect[i].asset = asset;
					self.status.assetsLoaded++;
					self.trigger(self.event.progress);
					i++;
				}
				if(i < effect.length) {
					self.addEffect(effect[i], prepareEffectAsset);
				} else {
					// completed
					if(callback) setTimeout(function() { callback(effect); }, 0);
				}
			};
			prepareEffectAsset();
		},
		appendTimeline: function(groupName, group, relativeTo, callback) {
			var self = this,
				myRelative = relativeTo[relativeTo.length - 1],
				i = 0;

			this.assets[groupName] = this.assets[groupName] ? this.assets[groupName] : [];
			this.group[groupName] = this.group[groupName] ? this.group[groupName] : [];
			this.group[groupName].push(group);

			var appendAsset = function(asset) {
				var f, fLen;

				// This part applies to the asset just created, where its reference has been passed back.

				if(asset) {
					group[i].asset = asset;
					asset.tEnd = asset.time + asset.duration;
					asset.relAssetStart = i > 0 ? group[i - 1].asset : myRelative.asset;

					for(f = 0, fLen = asset.fader ? asset.fader.length : 0; f < fLen; f++) {
						if(asset.fader[f].rel === 'end') {
							asset.fader[f].time = asset.tEnd + asset.fader[f].tRel;
						} else {
							asset.fader[f].time = asset.time + asset.fader[f].tRel;
							asset.fader[f].rel = 'start'; // Set since the generic timing system defaults the other way. ie., to the end.
						}
						asset.fader[f].noGap = true; // Set since the generic timing system would add the gap on.
						asset.fader[f].relAssetStart = asset; // So its timings are relative to iself
					}

					$(asset).bind(self.event.playasset, function() {
						self.trigger(self.event.playasset, this);
					});

					self.status.assetsLoaded++;
					self.trigger(self.event.progress);
					i++;
				}

				// This part applies to the asset being created. Remember that the asset var points to the previous one just created.

				if(i < group.length) {
					group[i].tRel = group[i].tRel ? group[i].tRel : 0;
					if(group[i].rel === 'start') {
						group[i].time = asset ? asset.time + group[i].tRel : myRelative.time + group[i].tRel;
					} else if(group[i].noGap) {
						group[i].time = asset ? asset.tEnd + group[i].tRel : myRelative.tEnd + group[i].tRel;
					} else {
						group[i].time = asset ? asset.tEnd + self.tGap[groupName] + group[i].tRel : myRelative.tEnd + self.tGap[groupName] + group[i].tRel;
					}

					// Define the gains and effect from track/env styling.
					group[i].effect = self.trackEnv[group[i].track][group[i].env].effect;
					group[i].bufferGain = self.trackEnv[group[i].track][group[i].env].bufferGain;
					group[i].effectGain = self.trackEnv[group[i].track][group[i].env].effectGain;
					group[i].bufferFilterGain = self.trackEnv[group[i].track][group[i].env].bufferFilterGain;
					group[i].effectFilterGain = self.trackEnv[group[i].track][group[i].env].effectFilterGain;

					group[i].depth = group[i].depth || self.trackEnv[group[i].track][group[i].env].depth;

					group[i].fallbackNormalizer = self.fallbackNormalizer;

					for(f = 0, fLen = group[i].fader ? group[i].fader.length : 0; f < fLen; f++) {
						group[i].fader[f].bufferGain = group[i].bufferGain * self.faderStyle[group[i].faderStyle][f].bufferRatio;
						group[i].fader[f].effectGain = group[i].effectGain * self.faderStyle[group[i].faderStyle][f].effectRatio;
						group[i].fader[f].bufferFilterGain = group[i].bufferFilterGain * self.faderStyle[group[i].faderStyle][f].bufferFilterRatio;
						group[i].fader[f].effectFilterGain = group[i].effectFilterGain * self.faderStyle[group[i].faderStyle][f].effectFilterRatio;
					}

					// Added the filter option here as it is trivial.
					if(group[i].filterStyle) {
						group[i].filter = self.filterStyle[group[i].filterStyle];
					}

					if(group[i].url || group[i].mp3) {
						self.addSound(groupName, group[i], appendAsset);
					} else {
						self.generateSpeech(groupName, group[i], appendAsset);
					}
				} else {
					// completed
					if(callback) setTimeout(function() { callback(group); }, 0);
				}
			};
			appendAsset();
		},
		// branchTimeline ? no
		attachBranches: function(timeline, group, callback) {
			var self = this,
			groupName = 'branch',
			i = 0;

			this.assets[groupName] = this.assets[groupName] ? this.assets[groupName] : [];
			this.group[groupName] = this.group[groupName] ? this.group[groupName] : [];
			this.group[groupName].push(group);

			var findRelativeId = function(timingEntity, options, relIdName) {
				// timingEntity: The pointer to the asset or to the fader

				var timeName = 'time',
				relAssetName = 'relAssetStart',
				relName = 'rel',
				tRelName = 'tRel';

				if(relIdName === 'tEndId') {
					timeName = 'tEnd';
					relAssetName = 'relAssetEnd';
					relName = 'relEnd';
					tRelName = 'tRelEnd';
				}

				timingEntity[relAssetName] = self.findAsset(timeline, options[relIdName]);

				// The timeId and tEndId share the same rel and noGap settings.
				if(timingEntity[relAssetName]) {
					if(timingEntity[relName] === 'end') {
						timingEntity[timeName] = timingEntity[relAssetName].tEnd + timingEntity[tRelName];
					} else {
						timingEntity[timeName] = timingEntity[relAssetName].time + timingEntity[tRelName];
						timingEntity[relName] = 'start'; // Set since the generic timing system defaults the other way. ie., to the end.
					}
					timingEntity.noGap = true; // Set since the generic timing system would add the gap on.
				} else if(relIdName === 'tEndId') {
					timingEntity[timeName] = timingEntity.time + timingEntity.duration; // Sets tEnd for those branches without tEndId defined.
				}
			};

			var attachAsset = function(asset) {

				var f = 0, fLen = 0;
				if(asset) {
					findRelativeId(asset, group[i], 'timeId');
					findRelativeId(asset, group[i], 'tEndId');
					for(f = 0, fLen = asset.fader ? asset.fader.length : 0; f < fLen; f++) {
						findRelativeId(asset.fader[f], asset.fader[f], 'id');
					}

					$(asset).bind(self.event.playasset, function() {
						self.trigger(self.event.playasset, this);
					});

					self.status.assetsLoaded++;
					self.trigger(self.event.progress);
					i++;
				}
				if(i < group.length) {
					// Define the gains and effect from track/env styling.
					group[i].effect = self.trackEnv[group[i].track][group[i].env].effect;
					group[i].bufferGain = self.trackEnv[group[i].track][group[i].env].bufferGain;
					group[i].effectGain = self.trackEnv[group[i].track][group[i].env].effectGain;
					group[i].bufferFilterGain = self.trackEnv[group[i].track][group[i].env].bufferFilterGain;
					group[i].effectFilterGain = self.trackEnv[group[i].track][group[i].env].effectFilterGain;

					group[i].depth = group[i].depth || self.trackEnv[group[i].track][group[i].env].depth;

					group[i].fallbackNormalizer = self.fallbackNormalizer;

					for(f = 0, fLen = group[i].fader ? group[i].fader.length : 0; f < fLen; f++) {
						group[i].fader[f].bufferGain = group[i].bufferGain * self.faderStyle[group[i].faderStyle][f].bufferRatio;
						group[i].fader[f].effectGain = group[i].effectGain * self.faderStyle[group[i].faderStyle][f].effectRatio;
						group[i].fader[f].bufferFilterGain = group[i].bufferFilterGain * self.faderStyle[group[i].faderStyle][f].bufferFilterRatio;
						group[i].fader[f].effectFilterGain = group[i].effectFilterGain * self.faderStyle[group[i].faderStyle][f].effectFilterRatio;
					}

					if(group[i].filterStyle) {
						group[i].filter = self.filterStyle[group[i].filterStyle];
					}

					if(group[i].url || group[i].mp3) {
						self.addSound(groupName, group[i], attachAsset);
					} else {
						self.generateSpeech(groupName, group[i], attachAsset);
					}
				} else {
					// completed
					if(callback) setTimeout(function() { callback(group); }, 0);
				}
			};
			attachAsset();
		},
		findAsset: function(timeline, id) {
			for(var i = 0, len = this.assets[timeline].length; i < len; i++) {
				if(this.assets[timeline][i].id && id && this.assets[timeline][i].id === id) {
					return this.assets[timeline][i];
				}
			}
			return false;
		},
		addEffect: function(options, callback) {
			// options : Object : Properties: type, text, url
			options.type = 'effect';
			var self = this,
			startTime = Date.now(),
			index = this.assets.effect.length;

			this.assets.effect.push(new Asset({context:self.context, depthGain:self.depthGain}));
			this.assets.effect[index].loadResource(options, function(asset) {
				// if(DEBUG) console.log('perceptive.media.js : PerceptiveMedia.addEffect() : adding asset took ' + (Date.now()-startTime).toFixed(2) + ' ms');
				if(callback) callback(asset);
			});
			return index;
		},
		addSound: function(groupName, options, callback) {
			// options : Object : Properties: type, text, url, time, effect, bufferGain, effectGain
			options.type = 'sound';
			var self = this,
			startTime = Date.now(),
			index = this.assets[groupName].length;

			this.assets[groupName].push(new Asset({context:self.context, destination:self.destination, depthGain:self.depthGain, analyser:self.analyser}));
			this.assets[groupName][index].loadResource(options, function(asset) {
				if(options.effect !== undefined) {
					asset.effect({effectAsset: self.assets.effect[options.effect], bufferGain: options.bufferGain, effectGain: options.effectGain});
				}
				// asset.play(options.time);

				// if(DEBUG) console.log('perceptive.media.js : PerceptiveMedia.addSound() : adding asset took ' + (Date.now()-startTime).toFixed(2) + ' ms');
				if(callback) callback(asset);
			});
			return index;
		},
		generateSpeech: function(groupName, options, callback) {
			// options : Object : Properties: text, time, bufferGain

			var self = this,
				startTime = Date.now(),
				index = this.assets[groupName].length;
			this.assets[groupName].push(new Asset({context:self.context, destination:self.destination, depthGain:self.depthGain, analyser:self.analyser}));
			this.callback.generateSpeech[index] = function(asset) {
				if(options.effect !== undefined) {
					asset.effect({effectAsset: self.assets.effect[options.effect], bufferGain: options.bufferGain, effectGain: options.effectGain});
				}
				if(callback) callback(asset);
			};

			// Call the worker, which will return a wav that we then play
			this.speakWorker.onmessage = function(event) {
				// if(DEBUG) console.log('perceptive.media.js : PerceptiveMedia.generateSpeech() : speak.js : worker processing took ' + (Date.now()-event.data.startTime).toFixed(2) + ' ms');
				self.assets[groupName][event.data.index].loadSpeakWav(event.data, self.callback.generateSpeech[event.data.index]);
			};
			this.speakWorker.postMessage({ options: options, index: index, startTime: startTime }); // NB: Passing the callback() through to the worker is not allowed.
			return index;
		},
		setTotalAssets: function(total) {
			this.status.assetsTotal = total;
		},
		updateStatus: function() {
			this.status.buffered = this.status.assetsTotal > 0 ? this.status.assetsLoaded / this.status.assetsTotal : 0;
		},
		trigger: function(eventType, asset) {
			var event = $.Event(eventType);
			this.updateStatus();
			event.pmedia = {};
			event.pmedia.status = $.extend(true, {}, this.status); // Deep copy
			event.pmedia.asset = asset; // Pass pointer to the asset
			$(this).trigger(event);
		}
	};

	// Private
	// var Asset = function(context, destination) {
	var Asset = function(setup) {

		this.context = setup.context; // Web Audio API: Chrome.
		this.destination = setup.destination; // Web Audio API: Chrome.
		this.depthGain = setup.depthGain; // Web Audio API: Chrome.
		this.analyser = setup.analyser; // Web Audio API: Chrome.

		this.duration = 0;
		this.playing = false;
		this.startTime = 0;

		this.id = '';

		this.track = '';
		this.env = '';

		this.subtitle = '';
		this.text = '';
		this.url = '';

		this.resource = {};

		this.time = 0;

		this.rel = '';
		this.noGap = false;
		this.tRel = 0;

		this.bufferGain = 0;
		this.effectGain = 0;

		this.bufferFilterGain = 0;
		this.effectFilterGain = 0;

		this.fader = [];
/*
		this.request;
		this.resourceBuffer;

		this.buffer;
		this.effectAsset;

		this.relAssetStart;
*/
	};
	Asset.prototype = {
		shared: { // Static: Shared by all instances.
			autoId: 0
		},
		play: function() {},
		stop: function() {},
		playNow: function() {
			this.play(this.time);
		},
		setAssetOptions: function(options) {
			this.type = options.type;

			this.id = options.id || 'auto_' + this.shared.autoId; // Optional: The id of the asset, enabling cross reference to timeline and id for parallel timeline relative assets.
			this.shared.autoId++;

			this.track = options.track; // The asset's track style.
			this.env = options.env; // The asset's environment style.

			this.depth = options.depth; // (String) The asset's depth staging from the track/env style, or explicit asset option.

			this.subtitle = options.subtitle || options.text || ''; // The english subtitle, usually equals the text, except where phonetics used for generated speech.
			this.text = options.text || ''; // The text or description of the sound. Required for generated speech.

			this.url = options.url; // Optional: If undefined, the text speech is generated.
			this.mp3 = options.mp3; // Forced mp3 urls. ie., Sound formats outside our control.
			this.wav = options.wav; // The base64 encoded WAV data, used by the fallback with the speak.js WAV.

			if(this.url && this.url.replace) {
				this.resource.wav = options.url.replace(/#FMT#/g, 'wav');
				this.resource.mp3 = options.url.replace(/#FMT#/g, 'mp3');
				this.resource.oga = options.url.replace(/#FMT#/g, 'ogg'); // Note files use ogg and internal uses oga.
			} else if(this.wav) {
				this.resource.wav = this.wav;
			} else if(this.mp3) {
				this.resource.mp3 = this.mp3;
				// this.duration = options.duration;
			}

			this.duration = options.duration;
			this.tOffset = options.tOffset || 0;

			this.forceDuration = options.forceDuration;

			this.time = options.time ? options.time : 0; // The absolute start time of this asset. Calculated by relative timing system.

			this.rel = options.rel; // Optional: Relative to the end time (default) or to the start time of the relative. (When rel:'start' the timeline time-gap is not applied.)
			this.tRel = options.tRel || 0; // Optional: Default 0. Fine control of item's relative timings
			this.noGap = !!options.noGap; // Optional: To remove the time gap insertion to relative end timings.

			this.timeId = options.timeId; // The relative asset ID.
			this.tEndId = options.tEndId; // The relative asset ID.

			this.relEnd = options.relEnd; // Optional: The rel for the tEndId.
			this.tRelEnd = options.tRelEnd || 0; // Optional: Default 0. Fine control of item's relative timings

			this.loop = !!options.loop; // Optional: To remove the time gap insertion to relative end timings.

			// Copy the fader config
			this.faderStyle = options.faderStyle;
			for(var i = 0, len = options.fader ? options.fader.length : 0; i < len; i++) {
				this.fader[i] = this.fader[i] ? this.fader[i] : {};
				this.fader[i].id = options.fader[i].id;
				this.fader[i].rel = options.fader[i].rel;
				this.fader[i].tRel = options.fader[i].tRel ? options.fader[i].tRel : 0;
				this.fader[i].bufferGain = options.fader[i].bufferGain !== undefined ? options.fader[i].bufferGain : 1;
				this.fader[i].effectGain = options.fader[i].effectGain !== undefined ? options.fader[i].effectGain : 1;
				this.fader[i].bufferFilterGain = options.fader[i].bufferFilterGain !== undefined ? options.fader[i].bufferFilterGain : 1;
				this.fader[i].effectFilterGain = options.fader[i].effectFilterGain !== undefined ? options.fader[i].effectFilterGain : 1;
			}

			this.filterStyle = options.filterStyle;
			this.filter = options.filter;

			this.setAssetGains(options);
		},
		setAssetGains: function(options) {
			this.bufferGain = options.bufferGain !== undefined ? options.bufferGain : 1; // The gain applied to the original sound.
			this.effectGain = options.effectGain !== undefined ? options.effectGain : 1; // The gain applied to the effect version of the sound.
			this.bufferFilterGain = options.bufferFilterGain !== undefined ? options.bufferFilterGain : 1; // The gain applied to the filtered original sound.
			this.effectFilterGain = options.effectFilterGain !== undefined ? options.effectFilterGain : 1; // The gain applied to the filtered effect version of the sound.

			this.fallbackNormalizer = options.fallbackNormalizer !== undefined ? options.fallbackNormalizer : 1; // The normalization applied to the fallback.
		},
		loadSpeakWav: function(data, callback) {
			// data : Object : Properties: wav, options
			// data.options : Object : Properties: text, time, bufferGain
			// callBack : function : Optional callback function

			var self = this,
			startTime = Date.now(),
			options = data.options;

			options.type = 'sound';

			if(this.context) {
				var buffer = new ArrayBuffer(data.wav.length),
				bufferView = new Uint8Array(buffer),
				len = data.wav.length,
				i;
				for(i=0; i < len; i++) {
					bufferView[i] = data.wav[i];
				}
				this.resourceBuffer = buffer;
				this.setAssetOptions(options);
				this.prepareAssetWebAudioAPI(callback);
			} else {
				options.wav = 'data:audio/wav;base64,' + this.encode64(data.wav);
				this.loadResource(options, callback);

			}
		},
		loadResource: function(options, callback) {
			// options : Object : Properties: type, text, url, time, bufferGain
			// callBack : function : Optional callback function

			var self = this,
				startTime = Date.now();

			this.setAssetOptions(options);

			if(self.context && this.url) {

				this.WebAudioAPI = this.WebAudioAPI || {};

				this.request = new XMLHttpRequest();

				if(this.type === 'effect' || options.loop) {
					this.WebAudioAPI.url = this.resource.wav;
				} else {
					this.WebAudioAPI.url = this.resource.mp3;
				}
				this.request.open("GET", this.WebAudioAPI.url, true);

				this.request.responseType = "arraybuffer";
				this.request.onload = function() {

					// if(DEBUG) console.log('perceptive.media.js : Asset.loadResource() : loading took ' + (Date.now()-startTime).toFixed(2) + ' ms');

					self.resourceBuffer = self.request.response;
					self.prepareAssetWebAudioAPI(callback);

				};
				this.request.send();
			} else {
				// fallback. Chrome uses this too for timeline entities with the mp3 prop defined.
				this.prepareAssetFallback(callback);
			}
		},
		prepareAssetWebAudioAPI: function(callback) { // Chrome
			var self = this,
			startTime = Date.now();

			// decodeAudioData(audioData, successCallback, errorCallback);
			this.context.decodeAudioData(this.resourceBuffer, function(buffer) {
				self.buffer = buffer;
				// self.duration = buffer.duration;
				self.duration = self.duration || buffer.duration;

				self.prepareMethodsWebAudioAPI();

				if(self.type === 'effect') {
					self.convolver = self.context.createConvolver();
					self.convolver.buffer = self.buffer;
					self.convolver.connect(self.context.destination);

					// Destination is not used by effects directly, the inputs to the effect require the different depth staging.
					self.destination = {
						foreground: self.context.createGainNode(),
						background: self.context.createGainNode()
					};
					self.destination.foreground.connect(self.convolver);
					self.destination.background.connect(self.convolver);

					self.updateDepthGains();
				}
				// if(DEBUG) console.log('perceptive.media.js : Asset.prepareAssetWebAudioAPI() : decoding and preparing for use took ' + (Date.now()-startTime).toFixed(2) + ' ms');
				if(callback) callback(self);
			}, function() {
				// if(DEBUG) console.log('perceptive.media.js : Asset.prepareAssetWebAudioAPI() : decoding failed');
			});
		},
		prepareMethodsWebAudioAPI: function() { // Chrome
			var self = this;
			if(this.type === 'sound') {
				// this.WebAudioAPI = this.WebAudioAPI = this.WebAudioAPI ? this.WebAudioAPI : {};
				this.WebAudioAPI = this.WebAudioAPI || {};
				this.play = function(time) {
					if(!self.playing) {
						// self.playing = true;
						time = time ? time * 1 : 0;
						var relTime = self.time - time,
						relTimeEnd = self.tEnd - time,
						playID, stopID;

						// if(relTime >= 0 || relTime >= -self.duration || (self.loop && self.tEnd - time > 0)) { // Only need 2nd clause?
						if(relTime >= -self.duration || (self.loop && relTimeEnd > 0)) {

							self.playing = true;
							self.startTime = self.context.currentTime - time;

							if(self.mp3) {
								// if(DEBUG) console.log('perceptive.media.js : [prepareMethodsWebAudioAPI] Asset.play() : self.WebAudioAPI.source = ' + self.WebAudioAPI.source);
								if(!self.WebAudioAPI.source) {
									var audioElem = self.myPlayer.data('jPlayer').htmlElement.audio;
									// if(DEBUG) console.log('perceptive.media.js : [prepareMethodsWebAudioAPI] Asset.play() : self.myPlayer = ' + self.myPlayer);
									// if(DEBUG) console.log('perceptive.media.js : [prepareMethodsWebAudioAPI] Asset.play() : jPlayer.htmlElement.audio.id = ' + audioElem.id);
									self.WebAudioAPI.source = self.context.createMediaElementSource(audioElem);
								} else {
									// if(DEBUG) console.log('perceptive.media.js : [prepareMethodsWebAudioAPI] Asset.play() : jPlayer audio source setup previously');
								}
							} else {
								self.WebAudioAPI.source = self.context.createBufferSource();
								self.WebAudioAPI.source.buffer = self.buffer;
							}

							self.WebAudioAPI.source.connect(self.analyser[self.track]);

							self.WebAudioAPI.gainNode1 = self.context.createGainNode();
							// self.WebAudioAPI.gainNode1.connect(self.context.destination);
							self.WebAudioAPI.gainNode1.connect(self.destination[self.depth]);
							self.WebAudioAPI.source.connect(self.WebAudioAPI.gainNode1);

							if(self.effectAsset) {
								self.WebAudioAPI.gainNode2 = self.context.createGainNode();
								// self.WebAudioAPI.gainNode2.connect(self.effectAsset.convolver);
								self.WebAudioAPI.gainNode2.connect(self.effectAsset.destination[self.depth]);
								self.WebAudioAPI.source.connect(self.WebAudioAPI.gainNode2);
							}

							if(self.filter) {
								self.WebAudioAPI.filter = self.context.createBiquadFilter();
								// filter config set in applyGains()
								self.WebAudioAPI.source.connect(self.WebAudioAPI.filter);

								self.WebAudioAPI.gainNode3 = self.context.createGainNode();
								// self.WebAudioAPI.gainNode3.connect(self.context.destination);
								self.WebAudioAPI.gainNode3.connect(self.destination[self.depth]);
								self.WebAudioAPI.filter.connect(self.WebAudioAPI.gainNode3);

								if(self.effectAsset) {
									self.WebAudioAPI.gainNode4 = self.context.createGainNode();
									// self.WebAudioAPI.gainNode4.connect(self.effectAsset.convolver);
									self.WebAudioAPI.gainNode4.connect(self.effectAsset.destination[self.depth]);
									self.WebAudioAPI.filter.connect(self.WebAudioAPI.gainNode4);
								}
							}

							if(self.mp3) {

								// Basically this bit is identical to the fallback code

								if(relTime >= 0) {
									playID = setTimeout(function() {
										if(self.tOffset) {
											self.myPlayer.jPlayer("play", self.tOffset);
										} else {
											self.myPlayer.jPlayer("play");
										}
										$(self).trigger(PerceptiveMedia.prototype.event.playasset);
									}, relTime * 1000);
								} else {
									self.myPlayer.jPlayer("play", -relTime + self.tOffset);
									// Give the event, as it was effectively played in the past when compared to this new start time.
									$(self).trigger(PerceptiveMedia.prototype.event.playasset);
								}

								if(self.loop || self.forceDuration) {
									stopID = setTimeout(function() {
										self.myPlayer.jPlayer("stop");
									}, relTimeEnd * 1000);
								}

								self.stop = function() {
									clearTimeout(playID);
									clearTimeout(stopID);
									self.playing = false;
									self.myPlayer.jPlayer("stop");
									self.stop = function() {};
								};

							} else {
								if(relTime >= 0) {
									self.WebAudioAPI.source.noteOn(self.context.currentTime + relTime);
									playID = setTimeout(function() {
										$(self).trigger(PerceptiveMedia.prototype.event.playasset);
									}, relTime * 1000);
								} else {
									// granular play or is a loop
									var timeWhen = 0, // self.context.currentTime + relTime
									// Use a loop that has 2 loops in it.
									grainOffset = self.loop ? (time - self.time) % (self.duration / 2) : -relTime,
									grainDuration = self.loop ? (self.duration / 2) : self.duration + relTime;

									self.WebAudioAPI.source.noteGrainOn(timeWhen, grainOffset, grainDuration); // NB: relTime would be negative here, so could just have 1st param as zero.

									// Give the event, as it was effectively played in the past when compared to this new start time.
									$(self).trigger(PerceptiveMedia.prototype.event.playasset);

									// if(DEBUG) console.log('perceptive.media.js : [prepareMethodsWebAudioAPI] Asset.play() : noteGrainOn(' + timeWhen + ', ' + grainOffset + ', ' + grainDuration + ') : asset.text: ' + self.text);
								}

								if(self.loop) {
									self.WebAudioAPI.source.loop = true;
									// self.WebAudioAPI.source.noteOff(self.context.currentTime + relTime + self.tEnd);
									self.WebAudioAPI.source.noteOff(self.context.currentTime + relTimeEnd);
									// if(DEBUG) console.log('perceptive.media.js : [prepareMethodsWebAudioAPI] Asset.play() : loop noteOff(' + relTimeEnd + ') : asset.text: ' + self.text);
								}

								self.stop = function() {
									clearTimeout(playID);
									self.playing = false;
									self.WebAudioAPI.source.noteOff(0);
									// self.releaseWebAudioApi();
									self.stop = function() {};
								};
							}

							self.applyGains(time);

							// if(DEBUG) console.log('perceptive.media.js : [prepareMethodsWebAudioAPI] Asset.play() : noteOn()');
						} else {
							// Give the event, as it was effectively played in the past when compared to this new start time.
							$(self).trigger(PerceptiveMedia.prototype.event.playasset);
						}
					}
				};
			}
		},
		// This method is only used by the loader system to synch the story with the loader music.
		getGrainRemaining: function() {
			if(this.playing) {
				var time = this.context.currentTime - this.startTime,
				relTime = this.time - time;
				if(this.context) {
					var grainOffset = this.loop ? (time - this.time) % (this.buffer.duration / 2) : -relTime,
					grainRemaining = this.loop ? (this.buffer.duration / 2) - grainOffset : this.buffer.duration - grainOffset;
					this.WebAudioAPI.source.noteOff(this.context.currentTime + grainRemaining);
					return grainRemaining;
				} else {
					this.myPlayer.jPlayer("stop");
					return 0;
				}
			} else {
				return 0;
			}
		},
		// Unused. Was for testing releasing the AudioNodes, but bug pinpointed to createMediaElementSource() code. An official bug report found: http://code.google.com/p/chromium/issues/detail?id=112749
		releaseWebAudioApi: function() { // Chrome
			delete this.WebAudioAPI.source;
			delete this.WebAudioAPI.gainNode1;
			delete this.WebAudioAPI.gainNode2;
			delete this.WebAudioAPI.gainNode3;
			delete this.WebAudioAPI.gainNode4;
			delete this.WebAudioAPI.filter;
		},
		prepareAssetFallback: function(callback) {
			var self = this,
			supplied = '',
			firstSupplied = true,
			firstDuration = true,
			startTime = Date.now();

			// A function to help create the supplied string for jPlayer.
			var addSupplied = function(format) {
				if(self.resource[format]) {
					supplied += firstSupplied ? format : ',' + format;
					firstSupplied = false;
				}
			};
			// Add the formats in the desired priority.
			if(this.loop) {
				addSupplied('wav');
				addSupplied('mp3');
				addSupplied('oga');
			} else {
				addSupplied('mp3');
				addSupplied('oga');
				addSupplied('wav');
			}

			this.myPlayer = $('<div></div>');
			$('body').append(this.myPlayer);

			this.myPlayer.bind($.jPlayer.event.ready, function(event) {

				// if(DEBUG) console.log('perceptive.media.js : Asset.prepareAssetFallback() : jPlayer ready took ' + (Date.now()-startTime).toFixed(2) + ' ms' + ' (' + self.text + ')');
				startTime = Date.now();

				$(this).jPlayer("setMedia", self.resource);

				if(self.context) {
					self.prepareMethodsWebAudioAPI();
				} else {
					self.prepareMethodsFallback();
				}
				if(self.mp3) {
					if(callback) setTimeout(function() { callback(self); }, 0);
				}
			});

			if(!self.mp3) {
				this.myPlayer.bind($.jPlayer.event.durationchange, function(event) {
					// if(DEBUG) console.log('perceptive.media.js : Asset.prepareAssetFallback() : jPlayer durationchange (' + (firstDuration ? 'first' : 'Nth') + ') took ' + (Date.now()-startTime).toFixed(2) + ' ms' + ' (' + self.text + ')');
					// console.log('perceptive.media.js : Asset.prepareAssetFallback() : jPlayer durationchange (' + (firstDuration ? 'first' : 'Nth') + ') for audio : "' + self.subtitle + '"');
					if(firstDuration) {
						firstDuration = false;
						// self.duration = event.jPlayer.status.duration;
						self.duration = self.duration || event.jPlayer.status.duration;
						if(callback) setTimeout(function() { callback(self); }, 0);
					}
				});
			}

			// Instance jPlayer
			this.myPlayer.jPlayer({
				supplied:supplied,
				wmode:'window',
				swfPath:'assets/js/jplayer',
				volume: self.fallbackNormalizer * Math.max(self.bufferGain, self.bufferFilterGain),
				muted: !!self.context,
				loop: self.loop
			});
		},
		prepareMethodsFallback: function() {
			var self = this;
			if(this.type === 'sound') {
				this.Fallback = this.Fallback || {};
				this.play = function(time) {
					if(!self.playing) {
						time = time ? time * 1 : 0;
						var relTime = self.time - time,
						relTimeEnd = self.tEnd - time,
						playID, stopID;

						if(relTime >= -self.duration || (self.loop && relTimeEnd > 0)) {

							self.playing = true;

							if(relTime >= 0) {
								playID = setTimeout(function() {
									if(self.tOffset) {
										self.myPlayer.jPlayer("play", self.tOffset);
									} else {
										self.myPlayer.jPlayer("play");
									}
									$(self).trigger(PerceptiveMedia.prototype.event.playasset);
								}, relTime * 1000);
							} else {
								self.myPlayer.jPlayer("play", -relTime + self.tOffset);
								// Give the event, as it was effectively played in the past when compared to this new start time.
								$(self).trigger(PerceptiveMedia.prototype.event.playasset);
							}

							if(self.loop || self.forceDuration) {
								stopID = setTimeout(function() {
									self.myPlayer.jPlayer("stop");
								}, relTimeEnd * 1000);
							}

							self.stop = function() {
								clearTimeout(playID);
								clearTimeout(stopID);
								self.playing = false;
								self.myPlayer.jPlayer("stop");
								self.stop = function() {};
							};
						} else {
							// Give the event, as it was effectively played in the past when compared to this new start time.
							$(self).trigger(PerceptiveMedia.prototype.event.playasset);
						}
					}
				};
			}
		},
		updateDepthGains: function(depthGain) { // Only effect assest use this command.
			if(this.context) {
				this.depthGain = depthGain || this.depthGain;
				this.destination.foreground.gain.value = this.depthGain.foreground;
				this.destination.background.gain.value = this.depthGain.background;
			}
		},
		applyGains: function(time) {
			if(this.context) {
				if(!this.WebAudioAPI.gainNode1) {
					return; // can't have ever played
				}
				time = time !== undefined ? time : this.context.currentTime - this.startTime;

				if(this.filter) {
					this.WebAudioAPI.filter.type = this.filter.type;
					this.WebAudioAPI.filter.frequency.value = this.filter.frequency;
					this.WebAudioAPI.filter.Q.value = this.filter.Q;
					this.WebAudioAPI.filter.gain.value = this.filter.gain;
				}

				this.WebAudioAPI.gainNode1.gain.cancelScheduledValues(0);
				this.WebAudioAPI.gainNode1.gain.value = this.fader.length ? this.fader[0].bufferGain : this.bufferGain;
				if(this.effectAsset) {
					this.WebAudioAPI.gainNode2.gain.cancelScheduledValues(0);
					this.WebAudioAPI.gainNode2.gain.value = this.fader.length ? this.fader[0].effectGain : this.effectGain;
				}
				if(this.filter) {
					this.WebAudioAPI.gainNode3.gain.cancelScheduledValues(0);
					this.WebAudioAPI.gainNode3.gain.value = this.fader.length ? this.fader[0].bufferFilterGain : this.bufferFilterGain;
					if(this.effectAsset) {
						this.WebAudioAPI.gainNode4.gain.cancelScheduledValues(0);
						this.WebAudioAPI.gainNode4.gain.value = this.fader.length ? this.fader[0].effectFilterGain : this.effectFilterGain;
					}
				}

				for(var i = 0, len = this.fader.length; i < len; i++) {
					var relFaderTime = this.fader[i].time - time;
					// if(DEBUG) console.log('perceptive.media.js : [prepareMethodsWebAudioAPI] Asset.play() : fader : ' + i + ' : relFaderTime = ' + relFaderTime + ' : asset.text: ' + this.text);

					if(relFaderTime < 0) {
						this.WebAudioAPI.gainNode1.gain.linearRampToValueAtTime(this.fader[i].bufferGain, this.context.currentTime);
						if(this.effectAsset) {
							this.WebAudioAPI.gainNode2.gain.linearRampToValueAtTime(this.fader[i].effectGain, this.context.currentTime);
						}
						if(this.filter) {
							this.WebAudioAPI.gainNode3.gain.linearRampToValueAtTime(this.fader[i].bufferFilterGain, this.context.currentTime);
							if(this.effectAsset) {
								this.WebAudioAPI.gainNode4.gain.linearRampToValueAtTime(this.fader[i].effectFilterGain, this.context.currentTime);
							}
						}
						// if(DEBUG) console.log('perceptive.media.js : [prepareMethodsWebAudioAPI] Asset.play() : fader : ' + i + ' : relFaderTime = ' + relFaderTime + ' : init linear : asset.text: ' + this.text);
					} else {
						this.WebAudioAPI.gainNode1.gain.linearRampToValueAtTime(this.fader[i].bufferGain, this.context.currentTime + relFaderTime);
						if(this.effectAsset) {
							this.WebAudioAPI.gainNode2.gain.linearRampToValueAtTime(this.fader[i].effectGain, this.context.currentTime + relFaderTime);
						}
						if(this.filter) {
							this.WebAudioAPI.gainNode3.gain.linearRampToValueAtTime(this.fader[i].bufferFilterGain, this.context.currentTime + relFaderTime);
							if(this.effectAsset) {
								this.WebAudioAPI.gainNode4.gain.linearRampToValueAtTime(this.fader[i].effectFilterGain, this.context.currentTime + relFaderTime);
							}
						}
						// if(DEBUG) console.log('perceptive.media.js : [prepareMethodsWebAudioAPI] Asset.play() : fader : ' + i + ' : relFaderTime = ' + relFaderTime + ' : create linear : asset.text: ' + this.text);
					}
				}
			} else {
				// fallback
				this.myPlayer.jPlayer('volume', this.fallbackNormalizer * Math.max(this.bufferGain, this.bufferFilterGain));
			}
		},
		effect: function(options, callback) {
			// options : Object : Properties: effectAsset, bufferGain, effectGain
			// callBack : function : Optional callback function

			if(this.type === 'effect') {
				return false;
			}

			var self = this,
				startTime = Date.now();

			this.setAssetGains(options);

			if(this.context) {

				this.effectAsset = options.effectAsset; // The Impulse Response.

				this.prepareMethodsWebAudioAPI();

				// if(DEBUG) console.log('perceptive.media.js : Asset.effect() : wav convolution took ' + (Date.now()-startTime).toFixed(2) + ' ms');
			} else {
				// fallback
			}

			if(callback) setTimeout(function() { callback(self); }, 0);
			return true;
		},
		encode64: function(data) {
			var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
				PAD = '=',
				ret = '',
				leftchar = 0,
				leftbits = 0;
			for (var i = 0; i < data.length; i++) {
				leftchar = (leftchar << 8) | data[i];
				leftbits += 8;
				while (leftbits >= 6) {
					var curr = (leftchar >> (leftbits-6)) & 0x3f;
					leftbits -= 6;
					ret += BASE[curr];
				}
			}
			if (leftbits === 2) {
				ret += BASE[(leftchar&3) << 4];
				ret += PAD + PAD;
			} else if (leftbits === 4) {
				ret += BASE[(leftchar&0xf) << 2];
				ret += PAD;
			}
			return ret;
		}
	};
})(jQuery);