importScripts('speakGenerator.js');

onmessage = function(event) {
	postMessage( {
		options: event.data.options,
		args: event.data.args,
		wav: generateSpeech(event.data.options.text, event.data.args),
		index: event.data.index,
		startTime: event.data.startTime
	});
};

