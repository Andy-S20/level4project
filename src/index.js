import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native core and will be removed in a future release',
]);
LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);
