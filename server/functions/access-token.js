exports.handler = function (context, event, callback) {
	const AccessToken = require('twilio').jwt.AccessToken;
	const VoiceGrant = AccessToken.VoiceGrant;

	const twilioAccountSid = context.ACCOUNT_SID;
	const twilioApiKey = context.API_KEY_SID;
	const twilioApiSecret = context.API_SECRET;

	const outgoingApplicationSid = context.APP_SID;
	const pushCredentialSid = context.PUSH_CREDENTIAL_SID;
	const identity = event.from ? event.from : 'anonymous';

	const voiceGrant = new VoiceGrant({
		outgoingApplicationSid: outgoingApplicationSid, //twiML application SID, current one in .env is hooked to /make-call endpoint
		pushCredentialSid: pushCredentialSid,
	});

	const token = new AccessToken(
		twilioAccountSid,
		twilioApiKey,
		twilioApiSecret,
		{identity: identity}, //this identity is treated by twilio as callerId used in SIP
	);
	token.addGrant(voiceGrant);

	console.debug(`Call received from ${identity}`);

	callback(null, token.toJwt());
};
