import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import * as Notifications from 'expo-notifications';

// Impede que a tela de splash seja ocultada automaticamente.
SplashScreen.preventAutoHideAsync();

// Configura como as notificações devem se comportar com o app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'Courgette-Regular': require('../assets/fonts/Courgette-Regular.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        const petId = data?.petId as string;
        const petName = data?.petName as string;
        const type = data?.type as string;

        if (!petId) {
          console.log('Notificação recebida sem petId.');
          return;
        }

        if (type === 'NEW_INTEREST') {
          console.log(
            'Notificação de INTERESSE recebida, navegando para a lista:',
            petId,
          );
          router.push({
            pathname: '/(drawer)/pets/interested',
            params: { petId, petName: petName || 'Pet' }, //
          });
        } else {
          console.log(
            'Notificação PADRÃO recebida, navegando para o pet:',
            petId,
          );
          router.push({ pathname: '/(drawer)/pets/info', params: { petId } }); //
        }
      },
    );

    return () => subscription.remove();
  }, []);
  // -----------------------------------------------------------

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
