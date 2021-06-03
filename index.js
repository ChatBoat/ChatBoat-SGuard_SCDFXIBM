/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import MMKVStorage, {create} from 'react-native-mmkv-storage';

const MMKV = new MMKVStorage.Loader().initialize();
export const useStorage = create(MMKV);

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask(
	'RNCallKeepBackgroundMessage',
	() =>
		({name, callUUID, handle}) => {
			// Make your call here
			console.log(name, callUUID, handle);
			return Promise.resolve();
		},
);
