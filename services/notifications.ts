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
    console.log('As notificações push só funcionam em dispositivos físicos.');
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
    console.log('Permissão para receber notificações foi negada.');
    // Opcional: Informar ao usuário que ele não receberá notificações.
    // Alert.alert(
    //   'Permissão Negada',
    //   'Você não receberá notificações sobre novos pets para adoção.',
    // );
    return;
  }

  // 2. Obtém o Expo Push Token
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      // O projectId é essencial para o Expo identificar seu app
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });

    if (token.data) {
      console.log('Expo Push Token obtido:', token.data);
      // 3. Salva o token no documento do usuário no Firestore
      // A opção { merge: true } garante que não vamos sobrescrever outros dados do usuário
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { pushToken: token.data }, { merge: true });
      console.log('Token de notificação salvo para o usuário:', userId);
    }
  } catch (error) {
    console.error('Erro ao obter ou salvar o token de notificação:', error);
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
