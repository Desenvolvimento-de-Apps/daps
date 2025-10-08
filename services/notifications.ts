import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

/**
 * Registra o dispositivo para receber notificações push e salva o token no Firestore.
 * @param userId O ID do usuário logado.
 */
export async function registerForPushNotificationsAsync(userId: string) {
  // Notificações só funcionam em dispositivos físicos
  if (!Device.isDevice) {
    console.log('Push notifications are only available on physical devices.');
    return;
  }

  // 1. Verifica e pede permissão para notificações
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Permission to receive push notifications was denied.');

    Alert.alert(
      'Permissão Negada',
      'Você precisa habilitar as permissões de notificações nas configurações do dispositivo.',
    );
    return;
  }

  // 2. Obtém o Expo Push Token
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });

    if (token.data) {
      console.log('Expo Push Token:', token.data);
      // 3. Salva o token no documento do usuário no Firestore
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { pushToken: token.data }, { merge: true });
      console.log('Push token saved for user:', userId);
    }
  } catch (error) {
    console.error('Error getting or saving push token:', error);
  }

  // Configuração do canal para Android (necessário a partir do Android 8.0)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}
