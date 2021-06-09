# SCDF Innovation Challenge 2021
## Table of contents
* [Meet the Team](#meet-the-team)
* [Analysis of problem](#analysis-of-problem)
* [Our solution](#our-solution)
* [How it works](#how-it-works)
* [Meet the team](#team)
* [References](#references)

## Meet the Team
**Team ChatBoat**

We are a group of 5 graduates from Raffles Institution (RI) with diverse skills and backgrounds but with the common goal of wanting to make a difference in society. 
<img src="./readme/Profiles.png" width = 100%/>

## Analysis of problem

> As we emerge stronger from COVID-19, how might we leverage technology to evolve emergency response and public safety strategies to enhance the capability and resilience of SCDF to respond better in a pandemic situation?

SCDF is undergoing a paradigm shift towards crowdsourcing first responders as a novel public safety strategy to improve emergency response. This is most prominent in SCDF’s [myResponder App](https://www.scdf.gov.sg/home/community-volunteers/mobile-applications), through which SCDF can engage Certified First Responders (CFRs). When 995 is called, SCDF calls upon CFRs to provide help in the 5-10 min window before they arrive.

However, there have been uptake problems - As of July 2019, only 46,689 people have the app installed, and only 24.1% of the users actually respond [[1]](#reference-1). This strategy also requires all cases to go through SCDF before reaching the CFRs, taking slightly more precious time.

Additionally, in pandemic situations, there are 2 new problems:

- emptier places means it takes more time for someone to notice a medical emergency.
- fewer CFRs outside means it is unlikely for one to be near enough to the emergency site to offer help.

## Our Solution

<img src="./readme/SGuard.png" width = 100%/>

> SGuard is a Voice-Enabled Emergency Assistant that empowers the public to be First Responders (SGuardians) to medical emergencies.

SGuard monitors the vitals of its user via his or her phone and/or smartwatch. When the user collapses, the in-app AI Voicebot loudly calls for help to draw the attention of nearby civilians (SGuardians). SGuard then guides the SGuardian in doing a preliminary diagnosis via interactive verbal conversation. This is to provide aid to the user during the 5-10 min window before SCDF arrives, increasing their survivability.

### Comparison with MyResponder App

|Problem|Proposed Solution|
|-|-|
|Member of public unsure how to help|In-app AI voicebot provides guidance|
|Less CFRs outside due to pandemic|Larger pool of potential responders|
|Pandemic situation with less people around; takes longer for medical emergencies to be noticed|Automated detection|
|Low response rate given low number of CFRs|Any member of public can respond|
|Low uptake of MyResponder App | Single user utility which incentivizes uptake|
|Long time delay due to the centralised nature of MyResponder App|P2P SGuard app bypasses central authorities, enabling faster responses|

<img src="./readme/Response Flowchart.svg"/>

## How it works
<img src="./readme/architecture.png"/>

1. User falls down.
2. The SGuard app detects anomalous sensor readings and proceeds to
    - Emit an alarm using the phone speaker to alert passers-by
    -  Record speech using the phone's microphone

3. Initiate a call with the voicebot
4. Once the call has been initiated, Twilio relays the voice recording to Watson assistant
5. Watson Speech-to-Text uses machine learning to decode the user's speech and passes the transcript back to Watson assistant.
6. Watson Assistant uses natural language understanding and machine learning to extract entities and intents of the user question.
7. Watson Assistant chooses the best response out of those in its answer storage.
Watson Text to Speech encodes the message in the user's language.
8. Twilio relays the message back to the phone.
9. The SGuard app plays the message and awaits further queries.
We also intend to include a Node-RED cloud server to facilitate future integration with other SCDF services, such as the MyResponder app. 

## Technologies Used
- [IBM Watson Assistant](https://www.ibm.com/sg-en/cloud/watson-assistant)
- [IBM Watson Text to Speech](https://www.ibm.com/sg-en/cloud/watson-text-to-speech)
- [IBM Watson Speech to Text](https://www.ibm.com/sg-en/cloud/watson-speech-to-text)
- [IBM Watson Assistant Phone Integration](https://cloud.ibm.com/docs/assistant?topic=assistant-deploy-phone)
- [React Native](https://reactnative.dev/)
- [react-native-twilio-phone](https://github.com/MrHertal/react-native-twilio-phone)
  - [Twilio voIP Client SDK](https://www.twilio.com/docs/voice/voip-sdk/android)
- [Twilio Functions](https://www.twilio.com/docs/runtime/functions)


## References
<a id="reference-1">1.</a>

```bibtex
@article{doi:10.1080/10903127.2020.1777233,
    author = {Wei Ming Ng and Carl Ross De Souza and Pin Pin Pek and Nur Shahidah and Yih Yng Ng and Shalini Arulanandam and Alexander Elgin White and Benjamin Sieu-Hon Leong and Marcus Eng Hock Ong},
    title = {myResponder Smartphone Application to Crowdsource Basic Life Support for Out-of-Hospital Cardiac Arrest: The Singapore Experience},
    journal = {Prehospital Emergency Care},
    volume = {25},
    number = {3},
    pages = {388-396},
    year  = {2021},
    publisher = {Taylor & Francis},
    doi = {10.1080/10903127.2020.1777233}
    URL = {https://doi.org/10.1080/10903127.2020.1777233}
}
```
