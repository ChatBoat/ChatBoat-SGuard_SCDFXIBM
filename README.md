# SGuardApp

## Description
SGuard is a cloud-powered, voice-enabled chatbot application that empowers the public to offer aid to others in need regardless of their prior knowledge. 

SGuard does this by:

1. Detecting incidents such as falls and collapses
2. Alerting the SCDF and passers-by once these incidents have occured
3. Providing audio guidance on how to help victims

## How it works
<img src="./Readme/Architecture diagram/Architecture design V1.svg">

1. A user falls down.
2. The SGuard app detects an anomalous accelerometer reading and proceeds to
    - Emit an alarm using the phone speaker to alert passers-by
    - Call the SCDF using the phone's cellular service
    - Record speech using the phone's microphone
    - Send a SOS alert along with the recorded speech (in wav format) to the SGuard API
3. SGuard API relays the information to Node-RED
4. Node-RED calls the Watson Speech to Text service hosted in IBM Cloud. 
5. Watson Speech to Text uses machine learning to decode the user's speech.
6. Watson Speech to Text replies with a transcript of the user's speech and Node-RED calls Watson Assistant service hosted in IBM Cloud.
7. Watson Assistant uses natural language understanding and machine learning to extract entities and intents of the user question.
8. Source information on how to assist the victim from trusted SCDF data.
9. Watson Assistant replies to the user inquiry and Node-RED sends the text transcript to Watson Text to Speech.
10. Watson Text to Speech encodes the message in the user's language.
11. Node-RED sends the response (.wav file) to the SGuard API.
12. The SGuard API relays the response to the SGuard app. 
13. The SGuard app plays the response using the phone speakers.
