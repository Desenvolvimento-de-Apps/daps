import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import * as Notifications from 'expo-notifications';

// Impede que a tela de splash seja ocultada automaticamente.
SplashScreen.preventAutoHideAsync();

// Configura o handler de notificações para quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
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

  // --- NOVO: Listener para interação com notificações ---
  useEffect(() => {
    // Este listener é acionado quando o usuário toca em uma notificação
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // Extrai dados da notificação, como o ID do pet
        const petId = response.notification.request.content.data
          ?.petId as string;

        // Navega para a tela de informações do pet
        if (petId) {
          router.push({ pathname: '/(drawer)/pets/info', params: { petId } });
        }
      },
    );

    return () => subscription.remove();
  }, []);
  // ----------------------------------------------------

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
