import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import appConfigs from '../../app/appConfigs';

/**
 * @const {firebase.app.App}
 * @description Firebase API client
 */
const client = firebase.initializeApp(appConfigs.keys.firebase);
client.firestore().enablePersistence({ experimentalTabSynchronization: true }).catch(err => {
  if (err.code == 'failed-precondition') {
    console.log('Multiple tabs open!')
  } else if (err.code == 'unimplemented') {
    console.log('Unsuported browser');
  }
});

export default client;