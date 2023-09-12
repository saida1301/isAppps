import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

async function getFCMToken() {
  try {
    let fcmtoken = await AsyncStorage.getItem('fcmtoken');
    console.log(fcmtoken, 'old token');

    if (!fcmtoken) {
      const newToken = await messaging().getToken();
      if (newToken) {
        console.log(newToken, 'new token');
        await AsyncStorage.setItem('fcmtoken', newToken);
      }
    }
  } catch (error) {
    console.log(error, 'error in getFCMToken');
  }
}

export const BackgroundNotificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification
    );

    // You can navigate to a specific screen or perform an action here
  });

  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification
      );

      // You can navigate to a specific screen or perform an action here
    }
  });
};

// Call these functions to set up notification handling when your app starts
requestUserPermission();
getFCMToken();
BackgroundNotificationListener();
