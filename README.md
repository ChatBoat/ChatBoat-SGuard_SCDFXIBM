# SCDF Innovation Challenge 2021

## Analysis of Problem

> As we emerge stronger from COVID-19, how might we leverage technology to evolve emergency response and public safety strategies to enhance the capability and resilience of SCDF to respond better in a pandemic situation?

In recent times, the SCDF has had a paradigm shift towards crowdsourcing first responders as a novel public safety strategy to improve emergency response. This is most prominent in SCDF’s [MyResponder App](https://www.scdf.gov.sg/home/community-volunteers/mobile-applications), through which SCDF can engage Certified First Responders (CFRs). When a medical emergency occurs and 995 is called, SCDF can call upon a CFR to provide help in the 5 to 10 min window before they arrive.

However, there have been problems faced with regards to uptake - As of July 2019, only 46,689 people have the app installed, and only 24.1% of the users actually respond [[1]](#reference-1). This strategy also requires all cases to go through the SCDF before reaching the CFRs, taking slightly more precious time.

Additionally, due to circuit breakers and crowd restrictions during pandemic situations, there are 2 new problems:

- emptier places means more time is taken for someone to notice a medical emergency.
- fewer first responders outside means it is less likely for a first responder to be near enough to the emergency site to offer help.

## Our Solution

<img src="./Readme/SGuard.png"/>

> SGuard is a Voice-Enabled Emergency Assistant that empowers the public to be First Responders (SGuardians) to medical emergencies.

SGuard monitors the vitals of its user via his or her phone and/or smartwatch. When the user collapses, the in-app AI Voicebot loudly calls for help to draw the attention of nearby civilians (SGuardians). SGuard then guides the SGuardian in doing a preliminary diagnosis via interactive verbal conversation. This is to provide aid to the user during the 5 to 10 min window before SCDF arrives, increasing their survivability.

## Key Features

- IBM Cloud powered AI Voicebot that can diagnose common causes for collapsing & provide interactive verbal guidance
- Usage of phone and/or smartwatch sensors to detect medical emergencies
- Single user utility incentivizes uptake compared to relying on others to have the app
- Any member of the public can respond and become an SGuardian

## Comparison with MyResponder App

|Problem|Solution|
|-|-|
|Member of public unsure how to help|In-app AI voicebot provides guidance|
|Less CFRs outside due to pandemic|Larger pool of potential responders|
|Pandemic situation with less people around; takes longer for medical emergencies to be noticed|Automated detection|
|Low response rate given low number of CFRs|Any member of public can respond|
|Low uptake of MyResponder App | Single user utility which incentivizes uptake|
|Long time delay due to the centralised nature of MyResponder App|P2P SGuard app bypasses central authorities, enabling faster responses|

<img src="./Readme/Response Flowchart.svg"/>


## Team

Profile picture/Personalize yourself, your role (maybe the one submitted) and your slogan/credentials

## How it works
<img src="./Readme/Architecture diagram/Architecture design V3.png"/>

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
