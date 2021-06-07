exports.handler = function (context, event, callback) {
	const twiml = new Twilio.twiml.VoiceResponse();
	const callerId = event.from ? event.from : 'anonymous';
	const sipEndpoint = event.to ? event.to : '';

	console.log(`${callerId} attempting to start call to ${sipEndpoint}`);

	twiml.say(
		'Welcome to S-Guard Twilio API, redirecting to IBM Watson Assistant',
	);
	const dial = twiml.dial({callerId: callerId});

	dial.sip(sipEndpoint);
	//dial.sip(sipEndpoint);
	//dial.number(sipEndpoint);

	console.debug(twiml.toString());

	callback(null, twiml);
};
