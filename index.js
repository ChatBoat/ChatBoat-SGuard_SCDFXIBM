/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

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
