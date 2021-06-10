import 'react-native-gesture-handler'

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import MMKVStorage, { useMMKVStorage } from 'react-native-mmkv-storage'
import { RNTwilioPhone } from './src/RNTwilioPhone'

const MMKV = new MMKVStorage.Loader().initialize()
export const useStorage = (key) => useMMKVStorage(key, MMKV)

AppRegistry.registerComponent(appName, () => App)

//https://github.com/react-native-webrtc/react-native-callkeep#toggleaudioroutespeaker

/*
TODO
developer john:
- twilio voIP, call when locked (DONE)
- alarm sequence (should be on chatbot side i guess) (means chatbot is the one to notify SCDF via a hook?)
- simple cancel action (replace current stop call button)
- Actually max the volume. might need to modify ReactNativeCallkeep to have a function that can do that.
- backtoForeground doesnt work with keyguard. if you look in the java its complaining about wrong constants & stuff, look at that to figure out how to bypass keyguard
- the callkeep events not firing is a consequence of the metro reload system. I cant seem to google how to fix it properly.
- ^actually caused by not deregistering the listeners, but I cant deregister them else no background handling.
- should fix itself in a production build I guess.
- advanced fall detect + toggle for simple one for testing
- better UI

In theory, SIP address of chatbot should be fetched from twilio. not hardcoded but bleh
*/
